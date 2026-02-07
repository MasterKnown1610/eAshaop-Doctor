import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Alert,
} from 'react-native';
import {colors} from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';

const DocumentUpload = ({
  label,
  value,
  onChange,
  error,
  maxSize = 2 * 1024 * 1024, // 2MB default
}) => {
  const [selectedFile, setSelectedFile] = useState(value || null);

  const formatFileSize = bytes => {
    if (!bytes || bytes === 0) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });

      if (results && results.length > 0) {
        const file = results[0];
        const fileSize = file.size || 0;

        if (fileSize > maxSize) {
          Alert.alert('Error', `File size exceeds ${formatFileSize(maxSize)}`);
          return;
        }

        const fileData = {
          uri: file.uri,
          name: file.name || file.uri.split('/').pop(),
          type: file.type,
          size: fileSize,
        };

        setSelectedFile(fileData);
        if (onChange) {
          onChange(fileData);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
        return;
      }
      console.error('DocumentPicker Error:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.uploadBox, error && styles.uploadBoxError]}
        onPress={handleFileSelect}
        activeOpacity={0.7}>
        {selectedFile ? (
          <View style={styles.filePreview}>
            {selectedFile.type?.startsWith('image/') ? (
              <Image
                source={{uri: selectedFile.uri}}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <Icon name="document" size={40} color={colors.primary} />
            )}
            <View style={styles.fileInfo}>
              <Text variant="bodySmall" style={styles.fileName} numberOfLines={1}>
                {selectedFile.name}
              </Text>
              <Text variant="caption" style={styles.fileSize}>
                {formatFileSize(selectedFile.size)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation();
                handleRemove();
              }}
              style={styles.removeButton}>
              <Icon name="close-circle" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text variant="body" style={styles.browseText}>
              Browse
            </Text>
            <Text variant="caption" style={styles.maxSizeText}>
              Max Size: {formatFileSize(maxSize)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {error && (
        <Text variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  uploadBoxError: {
    borderColor: colors.error,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  browseText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
  },
  maxSizeText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fileSize: {
    color: colors.textSecondary,
  },
  removeButton: {
    padding: 4,
  },
  errorText: {
    marginTop: 4,
  },
});

export default DocumentUpload;
