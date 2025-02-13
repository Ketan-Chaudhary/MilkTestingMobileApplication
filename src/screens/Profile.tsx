import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, typography} from '../styles';

const Profile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://via.placeholder.com/100'}}
        style={styles.avatar}
      />
      <Text style={typography.title}>John Doe</Text>
      <Text style={typography.caption}>johndoe@example.com</Text>

      <View style={styles.statsContainer}>
        <Text style={typography.subtitle}>Test Statistics</Text>
        <View style={styles.statItem}>
          <Icon name="flask" size={24} color={colors.primary} />
          <Text style={typography.body}>Total Tests: 15</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="check" size={24} color={colors.secondary} />
          <Text style={typography.body}>Positive: 5</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="close" size={24} color={colors.error} />
          <Text style={typography.body}>Negative: 10</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  statsContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 10,
    elevation: 2,
    marginTop: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default Profile;
