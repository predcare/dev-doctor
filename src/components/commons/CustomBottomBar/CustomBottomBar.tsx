import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeIcon,
  PatientsIcon,
  ReportsIcon,
  ScheduleIcon,
  SettingsIcon,
} from '../../ui/icons';
import { AppRoute, DashboardTabParamList } from '../../../route';
import { navigationStyles } from '../../../styled/Navigation.styled';
import { theme } from '../../../styled/theme.styled';
import { navigationRef } from '../../../navigation/navigationRef';

export type TabKey = keyof DashboardTabParamList;

export interface TabConfig {
  key: TabKey;
  label: string;
  icon: (props: { color: string; size: number }) => React.ReactNode;
}

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
  onTabPress?: (tabKey: TabKey) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const CustomBottomBar: React.FC<CustomBottomBarProps> = ({
  state,
  descriptors,
  navigation: tabNavigation,
  activeTab: controlledActiveTab,
  onTabPress,
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<any>();

  // Determine current active tab from React Navigation state or fallback
  const activeTabFromNavigationState = useNavigationState((navState) => {
    if (!navState) return 'Home';
    // If inside a tab navigator, find the active tab name
    const currentRoute = navState.routes[navState.index];
    if (currentRoute?.name === 'MainTabs' && currentRoute.state) {
      const tabState = currentRoute.state as any;
      return tabState.routes[tabState.index]?.name || 'Home';
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
        tabNavigation.navigate(tabKey);
      }
      return;
    }

    // Standalone mode navigation
    if (tabKey === 'Schedule') {
      if (navigationRef.isReady()) {
        navigationRef.navigate(AppRoute.MAIN_TABS, {
          screen: 'Schedule',
          params: { refresh: true },
        });
      } else {
        rootNavigation.navigate(AppRoute.MAIN_TABS, {
          screen: 'Schedule',
          params: { refresh: true },
        });
      }
      return;
    }

    if (navigationRef.isReady()) {
      navigationRef.navigate(AppRoute.MAIN_TABS, {
        screen: tabKey,
      });
    } else {
      rootNavigation.navigate(AppRoute.MAIN_TABS, {
        screen: tabKey,
      });
    }
  };

  const tabBarHeight = 62 + insets.bottom;
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
        {BOTTOM_BAR_TABS.map((tab, index) => {
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
