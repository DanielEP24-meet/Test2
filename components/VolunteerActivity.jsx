import { TouchableOpacity , View, Text , StyleSheet , Image} from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const VolunteerActivity = ({id,  org, type, location, image }) => {
  return (
        <TouchableOpacity style={styles.activityContainer} onPress={() => {router.push(`search/${id}`)}}>
          <Image source={{ uri: image }} style={styles.activityImage} />
          <View style={styles.activityInfo}>
            <Text style={styles.orgName}>{org}</Text>
            <Text style={styles.activityType}>{type}</Text>
            <Text style={styles.activityTime}>{location}</Text>
          </View>
        </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f4f8',
    },
    scrollContent: {
      padding: 10,
    },
    activityContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginBottom: 20,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    activityImage: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
    },
    activityInfo: {
      padding: 15,
    },
    orgName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 5,
    },
    activityType: {
      fontSize: 16,
      color: '#34495e',
      marginBottom: 5,
    },
    activityTime: {
      fontSize: 14,
      color: '#7f8c8d',
    },
  });
export default VolunteerActivity