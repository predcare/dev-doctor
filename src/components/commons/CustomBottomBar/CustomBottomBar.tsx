import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StackActions, useNavigation, useNavigationState } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigationRef } from '../../../navigation/navigationRef';
import { DashboardTabParamList, RootStackParamList } from '../../../route';
import { navigationStyles } from '../../../styled/Navigation.styled';
import { theme } from '../../../styled/theme.styled';
import { HomeIcon, PatientsIcon, ReportsIcon, ScheduleIcon, SettingsIcon } from '../../ui/icons';

export type TabKey = keyof DashboardTabParamList;

export interface TabConfig {
  key: TabKey;
  label: string;
  icon: (props: { color: string; size: number }) => React.ReactNode;
}

export const BASE_TAB_BAR_HEIGHT = 60;

export const getBottomBarHeight = (bottomInset: number = 0): number => {
  return BASE_TAB_BAR_HEIGHT + bottomInset;
};

export const BOTTOM_BAR_TABS: TabConfig[] = [
  {
    key: 'Home',
    label: 'Home',
    icon: ({ color, size }) => <HomeIcon size={size} color={color} />,
  },
  {
    key: 'Patients',
    label: 'Patients',
    icon: ({ color, size }) => <PatientsIcon size={size} color={color} />,
  },
  {
    key: 'Schedule',
    label: 'Schedule',
    icon: ({ color, size }) => <ScheduleIcon size={size} color={color} />,
  },
  {
    key: 'Reports',
    label: 'Reports',
    icon: ({ color, size }) => <ReportsIcon size={size} color={color} />,
  },
  {
    key: 'Account',
    label: 'Account',
    icon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
  },
];

export interface CustomBottomBarProps extends Partial<BottomTabBarProps> {
  activeTab?: TabKey;
  visibleTabs?: TabKey[];
  onTabPress?: (tabKey: TabKey) => void;
  containerStyle?: StyleProp<ViewStyle>;
  isPathClear?: boolean;
}

export const CustomBottomBar: React.FC<CustomBottomBarProps> = ({
  state,
  navigation: tabNavigation,
  activeTab: controlledActiveTab,
  visibleTabs,
  onTabPress,
  containerStyle,
  isPathClear = false,
}) => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderedTabs = useMemo(() => {
    if (!visibleTabs || visibleTabs.length === 0) {
      return BOTTOM_BAR_TABS;
    }
    return visibleTabs
      .map(tabKey => BOTTOM_BAR_TABS.find(t => t.key === tabKey))
      .filter((tab): tab is TabConfig => Boolean(tab));
  }, [visibleTabs]);

  // Determine current active tab from React Navigation state or fallback
  const activeTabFromNavigationState = useNavigationState(navState => {
    if (!navState) return 'Home';
    const currentRoute = navState.routes[navState.index];
    if (currentRoute?.name === 'MainTabs' && currentRoute.state) {
      const tabState = currentRoute.state as {
        index?: number;
        routes?: Array<{ name?: string }>;
      };
      const focusedRouteName =
        typeof tabState.index === 'number' && tabState.routes
          ? tabState.routes[tabState.index]?.name
          : undefined;
      return (focusedRouteName as TabKey) || 'Home';
    }
    return (currentRoute?.name as TabKey) || 'Home';
  });

  const currentTabKey: TabKey = useMemo(() => {
    if (controlledActiveTab) return controlledActiveTab;
    if (state && state.routes && typeof state.index === 'number') {
      return (state.routes[state.index]?.name as TabKey) || 'Home';
    }
    return (activeTabFromNavigationState as TabKey) || 'Home';
  }, [controlledActiveTab, state, activeTabFromNavigationState]);

  const handleTabPress = (tabKey: TabKey, index: number) => {
    if (onTabPress) {
      onTabPress(tabKey);
      return;
    }

    if (state && tabNavigation) {
      const isFocused = state.index === index;
      const event = tabNavigation.emit({
        type: 'tabPress',
        target: state.routes[index]?.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        if (
          isPathClear &&
          'replace' in tabNavigation &&
          typeof tabNavigation.replace === 'function'
        ) {
          (tabNavigation.replace as (name: TabKey) => void)(tabKey);
        } else {
          tabNavigation.navigate(tabKey);
        }
      }
      return;
    }

    // Direct Stack Navigation
    if (currentTabKey === tabKey) {
      return;
    }

    if (isPathClear) {
      if (tabKey === 'Schedule') {
        if (navigationRef.isReady()) {
          try {
            navigationRef.dispatch(StackActions.replace('Schedule', { refresh: true }));
          } catch {
            navigationRef.navigate('Schedule', { refresh: true });
          }
        } else if (rootNavigation) {
          if (typeof rootNavigation.replace === 'function') {
            rootNavigation.replace('Schedule', { refresh: true });
          } else {
            rootNavigation.navigate('Schedule', { refresh: true });
          }
        }
      } else {
        if (navigationRef.isReady()) {
          try {
            navigationRef.dispatch(StackActions.replace(tabKey));
          } catch {
            navigationRef.navigate(tabKey);
          }
        } else if (rootNavigation) {
          if (typeof rootNavigation.replace === 'function') {
            rootNavigation.replace(tabKey);
          } else {
            rootNavigation.navigate(tabKey);
          }
        }
      }
      return;
    }

    if (tabKey === 'Schedule') {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Schedule', { refresh: true });
      } else if (rootNavigation) {
        rootNavigation.navigate('Schedule', { refresh: true });
      }
      return;
    }

    if (navigationRef.isReady()) {
      navigationRef.navigate(tabKey);
    } else if (rootNavigation) {
      rootNavigation.navigate(tabKey);
    }
  };

  const tabBarHeight = BASE_TAB_BAR_HEIGHT + insets.bottom;
  const tabBarPaddingBottom = Math.max(insets.bottom, 6);

  return (
    <View
      style={[
        navigationStyles.tabBar,
        {
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
        },
        containerStyle,
      ]}
      accessibilityRole="tablist"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {renderedTabs.map((tab, index) => {
          const isFocused = currentTabKey === tab.key;
          const color = isFocused ? theme.colors.primary : theme.colors.textSlate;

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => handleTabPress(tab.key, index)}
              style={navigationStyles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={tab.label}
            >
              <View style={{ alignItems: 'center' }}>
                <View
                  style={
                    isFocused
                      ? navigationStyles.activeIndicatorDot
                      : navigationStyles.inactiveIndicatorDot
                  }
                />
                <View
                  style={
                    isFocused
                      ? navigationStyles.activeIconContainer
                      : navigationStyles.inactiveIconContainer
                  }
                >
                  {tab.icon({ color, size: 20 })}
                </View>
                <Text
                  style={[
                    navigationStyles.tabLabel,
                    {
                      color,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomBar;
