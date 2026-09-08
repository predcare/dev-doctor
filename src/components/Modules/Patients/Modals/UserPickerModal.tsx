import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGetAllUsers } from '../../../../hooks/react-query/common/common.hooks';
import { getInitials, maskValue } from '../../../../lib/common/common.utils';
import { theme } from '../../../../styled/theme.styled';
import { IUserItem } from '../../../../typescripts/interfaces/allUsers.interfaces';
import { useAuthStore } from '../../../../zustand/stores/useAuthStore';
import CircleXIcon from '../../../ui/icons/CircleXIcon';
import SearchIcon from '../../../ui/icons/SearchIcon';

export type UserItem = IUserItem;
export type MockUserItem = IUserItem; // Re-export for backward compatibility

export interface UserPickerModalProps {
  visible: boolean;
  onClose: () => void;
  users?: IUserItem[];
  isLoading?: boolean;
  onPick: (user: IUserItem) => void;
}

export const UserPickerModal: React.FC<UserPickerModalProps> = React.memo(
  ({ visible, onClose, users, isLoading: externalLoading, onPick }) => {
    const { userData } = useAuthStore(state => state);
    const [searchText, setSearchText] = useState('');
    const {
      data: apiUsers,
      isFetching: isFetchingUsers,
      isLoading: isLoadingUsers,
      isError,
      refetch,
    } = useGetAllUsers(userData?.user_id, visible);

    const loading = externalLoading || (users === undefined && (isLoadingUsers || isFetchingUsers));

    const filteredUsers = useMemo(() => {
      if (!searchText.trim()) return apiUsers;
      const q = searchText.toLowerCase().trim();
      const rawDigits = q.replace(/\D/g, '');

      return apiUsers?.filter(u => {
        const nameMatch = u.name?.toLowerCase().includes(q);
        const emailMatch = u.email?.toLowerCase().includes(q);
        const phoneMatch = u.phone_number?.toLowerCase().includes(q);
        const phoneDigitMatch =
          rawDigits.length > 0 && u.phone_number?.replace(/\D/g, '').includes(rawDigits);

        return nameMatch || emailMatch || phoneMatch || phoneDigitMatch;
      });
    }, [apiUsers, searchText]);

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
          <View style={s.sheet} onStartShouldSetResponder={() => true}>
            <View style={s.sheetHead}>
              <View style={s.titleRow}>
                <Text style={s.sheetTitle}>Select Existing User</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={s.closeBtn}
              >
                <Text style={s.sheetX}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={s.searchContainer}>
              <View style={s.userSearchInputWrap}>
                <SearchIcon size={18} color={theme.colors.textMuted} />
                <TextInput
                  style={s.userSearchInput}
                  placeholder="Search by name, email, or phone..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchText('')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <CircleXIcon size={16} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {loading && apiUsers?.length === 0 ? (
              <View style={s.centerState}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={s.stateTxt}>Fetching existing users...</Text>
              </View>
            ) : isError && apiUsers?.length === 0 ? (
              <View style={s.centerState}>
                <Text style={s.errorTxt}>Failed to load users.</Text>
                <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
                  <Text style={s.retryBtnTxt}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredUsers}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => {
                  const subText = maskValue(item.email) || maskValue(item.phone_number) || 'No contact details';
                  return (
                    <TouchableOpacity
                      style={s.userRow}
                      onPress={() => {
                        onPick(item);
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={s.userAvatar}>
                        <Text style={s.userAvatarTxt}>{getInitials(item?.name || '')}</Text>
                      </View>
                      <View style={s.userInfo}>
                        <View style={s.userNameRow}>
                          <Text style={s.userName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          {item.gender ? (
                            <View style={s.genderTag}>
                              <Text style={s.genderTagTxt}>{item.gender}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={s.userSub} numberOfLines={1}>
                          {subText}
                        </Text>
                      </View>
                      <View style={s.selectBtn}>
                        <Text style={s.selectTxt}>Select</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                style={{ maxHeight: 380 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={s.centerState}>
                    {searchText.trim().length > 0 ? (
                      <>
                        <Text style={s.emptyTitle}>No matching users found</Text>
                        <Text style={s.emptySub}>No results match "{searchText.trim()}".</Text>
                        <TouchableOpacity
                          style={s.clearSearchBtn}
                          onPress={() => setSearchText('')}
                        >
                          <Text style={s.clearSearchTxt}>Clear Search</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text style={s.emptyTitle}>No users available</Text>
                        <Text style={s.emptySub}>
                          There are no registered users to link at this time.
                        </Text>
                      </>
                    )}
                  </View>
                }
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
);

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  sheetHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },

  closeBtn: {
    padding: 4,
  },
  sheetX: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  userSearchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    gap: 8,
    height: 44,
  },
  userSearchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.dark,
    paddingVertical: 0,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
    gap: 12,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarTxt: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    flexShrink: 1,
  },
  genderTag: {
    backgroundColor: theme.colors.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genderTagTxt: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'capitalize',
  },
  userSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  selectBtn: {
    backgroundColor: `${theme.colors.primary}12`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectTxt: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
  },
  centerState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateTxt: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  errorTxt: {
    fontSize: 14,
    color: theme.colors.danger || '#EF4444',
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryBtnTxt: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  clearSearchBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  clearSearchTxt: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default UserPickerModal;
