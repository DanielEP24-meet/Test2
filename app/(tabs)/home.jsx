// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
// import { useUser, fetchOrgs } from '../../context/userContext';
// import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
// import VolunteerActivity from '../../components/VolunteerActivity';

// const Home = () => {
//   const [orgs, setOrgs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser();

//   useEffect(() => {
//     const loadOrgData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const fetchedOrgs = await fetchOrgs();
//         if (!fetchedOrgs || typeof fetchedOrgs !== 'object') {
//           throw new Error('Fetched organizations data is not an object');
//         }
        
//         const orgsArray = await Promise.all(Object.entries(fetchedOrgs).map(async ([id, org]) => {
//           try {
//             if (org.orgPic) {
//               const storage = getStorage();
//               const imageRef = storageRef(storage, org.orgPic);
//               const imageUrl = await getDownloadURL(imageRef);
//               return {
//                 id,
//                 org: org.name,
//                 type: org.type || 'N/A',
//                 location: org.location || 'N/A',
//                 image: imageUrl
//               };
//             }
//             return {
//               id,
//               org: org.name,
//               type: org.type || 'N/A',
//               location: org.location || 'N/A',
//               image: null
//             };
//           } catch (imageError) {
//             console.error('Error fetching image for org:', org.name, imageError);
//             return {
//               id,
//               org: org.name,
//               type: org.type || 'N/A',
//               location: org.location || 'N/A',
//               image: null
//             };
//           }
//         }));
        
//         setOrgs(orgsArray);
//       } catch (error) {
//         console.error('Error fetching org data:', error);
//         setError(error.message);
//       }
//       setLoading(false);
//     };

//     loadOrgData();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3498db" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <ImageBackground source={{ imageUrl: '../../assets/images/homepagephoto.png' }} style={styles.headerBackground}>
//         <View style={styles.overlay} />
//         <View style={styles.headerContent}>
//           <Text style={styles.greeting}>Hello, {user?.username || 'User'}!</Text>
//           <Text style={styles.subtitle}>Be part of the change you want to see</Text>
//           <Text style={styles.description}>Join a community and make an impact in your area</Text>
//         </View>
//       </ImageBackground>
//       <View style={styles.orgList}>
//         {orgs.map((org) => (
//           <VolunteerActivity key={org.id} {...org} />
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f4f8',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f4f8',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f4f8',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   headerBackground: {
//     width: '100%',
//     height: 300,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   headerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   subtitle: {
//     fontSize: 20,
//     color: '#ffffff',
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: '#ffffff',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   orgList: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
// });

// export default Home;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, ImageBackground, Button } from 'react-native';
import { useUser, fetchOrgs } from '../../context/userContext';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import VolunteerActivity from '../../components/VolunteerActivity';
import { router } from 'expo-router';
import { homepage } from '../../assets/images/homepagephoto.png';
const Home = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const loadOrgData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedOrgs = await fetchOrgs();
        if (!fetchedOrgs || typeof fetchedOrgs !== 'object') {
          throw new Error('Fetched organizations data is not an object');
        }

        const orgsArray = await Promise.all(Object.entries(fetchedOrgs).map(async ([id, org]) => {
          try {
            if (org.orgPic) {
              const storage = getStorage();
              const imageRef = storageRef(storage, org.orgPic);
              const imageUrl = await getDownloadURL(imageRef);
              return {
                id,
                org: org.name,
                type: org.type || 'N/A',
                location: org.location || 'N/A',
                image: imageUrl
              };
            }
            return {
              id,
              org: org.name,
              type: org.type || 'N/A',
              location: org.location || 'N/A',
              image: null
            };
          } catch (imageError) {
            console.error('Error fetching image for org:', org.name, imageError);
            return {
              id,
              org: org.name,
              type: org.type || 'N/A',
              location: org.location || 'N/A',
              image: null
            };
          }
        }));

        setOrgs(orgsArray.slice(0, 2));
      } catch (error) {
        console.error('Error fetching org data:', error);
        setError(error.message);
      }
      setLoading(false);
    };

    loadOrgData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground  style={styles.headerBackground}>
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, {user?.username || 'User'}!</Text>
          <Text style={styles.subtitle}>Be part of the change you want to see</Text>
          <Text style={styles.description}>Join a community and make an impact in your area</Text>
        </View>
      </ImageBackground>
      <View style={styles.orgList}>
        {orgs.map((org) => (
          <VolunteerActivity key={org.id} {...org} />
        ))}
      </View>
      <Button  color='#8B0000' title="View All" onPress={() => router.push('/viewall')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  headerBackground: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B0000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  orgList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default Home;
