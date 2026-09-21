import React, { useState } from 'react';
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
import { useDebounce } from '../../../../hooks/commons/useDebounce';
import { useGetAllPatients } from '../../../../hooks/react-query/patients/patients.hooks';
import { getInitials } from '../../../../lib/common/common.utils';
import { theme } from '../../../../styled/theme.styled';
import { IUserItem } from '../../../../typescripts/interfaces/allUsers.interfaces';
import { IAllPatientsDoc } from '../../../../typescripts/interfaces/patients.interfaces';
import CircleXIcon from '../../../ui/icons/CircleXIcon';
import SearchIcon from '../../../ui/icons/SearchIcon';

export type UserItem = IUserItem;
export type MockUserItem = IUserItem; // Re-export for backward compatibility

export interface UserPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onPick?: (pat: IAllPatientsDoc) => void;
}

export const UserPickerModal: React.FC<UserPickerModalProps> = React.memo(
  ({ visible, onClose, onPick }) => {
    const [searchText, setSearchText] = useState('');
    const debounceSearch = useDebounce(searchText?.trim(), 500);
    const {
      data: allPatinets,
      isFetching: isFetchingPatient,
      isError,
      refetch,
    } = useGetAllPatients({
      limit: 10,
      page: 1,
      search: debounceSearch,
      user_type: 'patient',
    });

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
                  placeholder="Search by name, Patient-Id email, or phone..."
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
                    <CircleXIcon size={16} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {isFetchingPatient ? (
              <View style={s.centerState}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={s.stateTxt}>Fetching existing users...</Text>
              </View>
            ) : isError ? (
              <View style={s.centerState}>
                <Text style={s.errorTxt}>Failed to load users.</Text>
                <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
                  <Text style={s.retryBtnTxt}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={allPatinets?.data || []}
                keyExtractor={item => String(item.patient_id)}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={s.userRow}
                      activeOpacity={0.7}
                      onPress={() => {
                        onPick?.(item);
                        onClose();
                      }}
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
                          {item?.email || item?.phone_number}
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
