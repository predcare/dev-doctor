import React, { useState } from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import theme from '../../../styled/theme.styled';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../icons';

export interface CustomMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export interface CustomMenuProps {
    items: CustomMenuItem[];
    selectedId?: string;
    onSelect?: (id: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerLabel?: string;
    renderTrigger?: (state: { open: boolean }) => React.ReactNode;
    showChevron?: boolean;
    showSelectedCheck?: boolean;
    align?: 'left' | 'right';
    closeOnSelect?: boolean;
    triggerStyle?: StyleProp<ViewStyle>;
    menuStyle?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    triggerTextStyle?: StyleProp<TextStyle>;
    itemTextStyle?: StyleProp<TextStyle>;
    activeItemTextStyle?: StyleProp<TextStyle>;
}

export const CustomMenu: React.FC<CustomMenuProps> = ({
    items,
    selectedId,
    onSelect,
    open,
    onOpenChange,
    triggerLabel,
    renderTrigger,
    showChevron = true,
    showSelectedCheck = true,
    align = 'right',
    closeOnSelect = true,
    triggerStyle,
    menuStyle,
    itemStyle,
    triggerTextStyle,
    itemTextStyle,
    activeItemTextStyle,
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : uncontrolledOpen;

    const setOpen = (next: boolean) => {
        onOpenChange?.(next);
        if (!isControlled) {
            setUncontrolledOpen(next);
        }
    };

    const toggle = () => setOpen(!isOpen);

    const handleSelect = (item: CustomMenuItem) => {
        if (item.disabled) {
            return;
        }
        onSelect?.(item.id);
        if (closeOnSelect) {
            setOpen(false);
        }
    };

    return (
        <View collapsable={false} style={styles.root} onTouchStart={event => event.stopPropagation()}>
            <TouchableOpacity style={[styles.trigger, triggerStyle]} onPress={toggle} activeOpacity={0.8}>
                {renderTrigger ? (
                    renderTrigger({ open: isOpen })
                ) : (
                    <>
                        <Text style={[styles.triggerText, triggerTextStyle]}>{triggerLabel}</Text>
                        {showChevron ? (
                            isOpen ? (
                                <ChevronUpIcon size={12} color={theme.colors.primary} />
                            ) : (
                                <ChevronDownIcon size={12} color={theme.colors.primary} />
                            )
                        ) : null}
                    </>
                )}
            </TouchableOpacity>

            {isOpen && (
                <View
                    collapsable={false}
                    onTouchStart={event => event.stopPropagation()}
                    style={[
                        styles.menu,
                        menuStyle,
                        align === 'left' ? styles.menuLeft : styles.menuRight,
                        styles.menuStack,
                    ]}
                >
                    {items.map(item => {
                        const selected = item.id === selectedId;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleSelect(item)}
                                activeOpacity={0.75}
                                disabled={item.disabled}
                                style={[styles.item, item.disabled && styles.itemDisabled, itemStyle]}
                            >
                                {item.icon ? <View style={styles.itemIcon}>{item.icon}</View> : null}
                                <Text
                                    style={[
                                        styles.itemText,
                                        itemTextStyle,
                                        selected && styles.itemTextActive,
                                        selected && activeItemTextStyle,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                                {showSelectedCheck && selected ? (
                                    <CheckIcon size={14} color={theme.colors.primary} />
                                ) : null}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        position: 'relative',
        zIndex: 1000,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        // backgroundColor: theme.colors.primarySoft,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        // borderWidth: 1,
        // borderColor: theme.colors.mintBdr,
    },
    triggerText: {
        fontSize: 12,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textGreen,
        lineHeight: 16
    },
    menu: {
        position: 'absolute',
        top: '100%',
        marginTop: 6,
        minWidth: 140,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.surfaceBorder,
        overflow: 'hidden',
    },
    menuLeft: {
        left: 0,
    },
    menuRight: {
        right: 0,
    },
    menuStack: {
        zIndex: 1000,
        elevation: 24,
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surfaceSecondary,
    },
    itemDisabled: {
        opacity: 0.4,
    },
    itemIcon: {
        marginRight: 8,
    },
    itemText: {
        flex: 1,
        fontSize: 12,
        color: theme.colors.textPrimary,
    },
    itemTextActive: {
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
});

export default CustomMenu;
