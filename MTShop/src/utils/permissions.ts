import { PermissionsAndroid, Platform } from 'react-native';

export async function requestGalleryPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const perm =
        Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const already = await PermissionsAndroid.check(perm);
    if (already) return true;

    const granted = await PermissionsAndroid.request(perm);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
}
