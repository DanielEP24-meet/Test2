// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList, ImageBackground } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import { fetchOrgs, useUser } from '../../context/userContext';
// import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Calendar } from 'react-native-calendars';
// import { getDatabase, ref as dbRef, update } from 'firebase/database'; // Import Firebase database

// const OrganizationPage = () => {
//   const { orgName } = useLocalSearchParams();
//   const { user, userLoading } = useUser();
//   const [orgData, setOrgData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
//   const [orgImage, setOrgImage] = useState(null);
//   const [isMember, setIsMember] = useState(false);
//   const [requestSent, setRequestSent] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [unavailableDates, setUnavailableDates] = useState({});

//   const timeSlots = Array.from({ length: 8 }, (_, i) => {
//     const time = 10 + i;
//     return time.toString().padStart(2, '0') + ":00";
//   });

//   useEffect(() => {
//     const loadOrgData = async () => {
//       if (orgName) {
//         try {
//           const result = await fetchOrgs({ [orgName]: '' });

//           if (result && result[orgName]) {
//             setOrgData(result[orgName]);
//             if (result[orgName].orgPic) {
//               const storage = getStorage();
//               const imageRef = storageRef(storage, result[orgName].orgPic);
//               const url = await getDownloadURL(imageRef);
//               setOrgImage(url);
//             }
//             setIsMember(user?.orgs ? Object.keys(user.orgs).includes(orgName) : false);
//           } else {
//             setError('Organization not found in the result');
//           }
//         } catch (error) {
//           console.error('Error fetching org data:', error);
//           setError(error.message || 'An error occurred while fetching data');
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setError('No organization name provided');
//         setLoading(false);
//       }
//     };

//     loadOrgData();
//   }, [orgName, user]);

//   useEffect(() => {
//     // Randomly select unavailable dates for the current month
//     const generateUnavailableDates = () => {
//       let unavailable = {};
//       const today = new Date();
//       const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

//       for (let i = 0; i < 10; i++) { // randomly pick 5 unavailable days
//         const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
//         const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${randomDay.toString().padStart(2, '0')}`;
//         unavailable[dateString] = { disabled: true, marked: true, dotColor: 'red', disableTouchEvent: true };
//       }
//       setUnavailableDates(unavailable);
//     };

//     generateUnavailableDates();
//   }, []);

//   const handleDayPress = (day) => {
//     if (unavailableDates[day.dateString]) return; // Prevent selecting unavailable dates
//     setSelectedDate(day.dateString);
//     setModalVisible(true);
//   };

//   const renderTimeSlot = ({ item }) => (
//     <TouchableOpacity
//       style={styles.timeSlotButton}
//       onPress={async () => {
//         setSelectedTimeSlot(item);
//         setModalVisible(false);

//         // Save the selected time in the database
//         const db = getDatabase();
//         const userTimeRef = dbRef(db, `Users/${user.uid}/times`);
//         await update(userTimeRef, { [orgName] : [item] });
//       }}
//     >
//       <Text style={styles.timeSlotText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   if (loading || userLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Loading...</Text>
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

//   if (!orgData) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Organization not found</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <ImageBackground
//         source={{ uri: orgImage || 'https://via.placeholder.com/400x200' }}
//         style={styles.orgImage}
//       >
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.8)']}
//           style={styles.gradient}
//         >
//           <Text style={styles.orgName}>{orgData.name}</Text>
//           <Text style={styles.orgType}>{orgData.type}</Text>
//           <Text style={styles.orgLocation}>{orgData.location}</Text>
//         </LinearGradient>
//       </ImageBackground>

//       {orgData.description && (
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>About</Text>
//           <Text style={styles.sectionText}>{orgData.description}</Text>
//         </View>
//       )}

//       {(orgData.email || orgData.phone) && (
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Contact</Text>
//           {orgData.email && <Text style={styles.sectionText}>Email: {orgData.email}</Text>}
//           {orgData.phone && <Text style={styles.sectionText}>Phone: {orgData.phone}</Text>}
//         </View>
//       )}

//       {orgData.volunteerOpportunities && orgData.volunteerOpportunities.length > 0 && (
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Volunteer Opportunities</Text>
//           {orgData.volunteerOpportunities.map((opportunity, index) => (
//             <View key={index} style={styles.opportunityItem}>
//               <Text style={styles.opportunityText}>• {opportunity}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {isMember && (
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Select a Day to Volunteer</Text>
//           <Calendar
//             onDayPress={handleDayPress}
//             markedDates={{
//               ...unavailableDates,
//               [selectedDate]: {
//                 selected: true,
//                 selectedDotColor: 'orange',
//               },
//             }}
//             theme={{
//               selectedDayBackgroundColor: '#5cb85c',
//               todayTextColor: '#00adf5',
//               arrowColor: '#5cb85c',
//               dotColor: '#5cb85c',
//               selectedDotColor: '#ffffff',
//               dayTextColor: '#2d4150',
//               textDisabledColor: '#d9e1e8',
//               monthTextColor: '#5cb85c',
//             }}
//             style={styles.calendar}
//           />
//         </View>
//       )}

//       {isMember && selectedTimeSlot && (
//         <Text style={styles.selectedTimeText}>Selected Time: {selectedTimeSlot === '11:00' ? 'eleven' : selectedTimeSlot}</Text>
//       )}

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <Text style={styles.modalTitle}>Select a Time Slot for {selectedDate}</Text>
//           <FlatList
//             data={timeSlots}
//             renderItem={renderTimeSlot}
//             keyExtractor={(item) => item}
//           />
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setModalVisible(false)}
//           >
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     fontSize: 18,
//     color: '#333',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#d9534f',
//     textAlign: 'center',
//     marginTop: 50,
//   },
//   orgImage: {
//     width: '100%',
//     height: 250,
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     padding: 20,
//   },
//   orgName: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
//   },
//   orgType: {
//     fontSize: 18,
//     color: '#eee',
//     marginBottom: 5,
//   },
//   orgLocation: {
//     fontSize: 16,
//     color: '#ddd',
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     marginTop: 20,
//     marginHorizontal: 15,
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   sectionText: {
//     fontSize: 16,
//     color: '#666',
//     lineHeight: 24,
//   },
//   opportunityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   opportunityText: {
//     fontSize: 16,
//     color: '#666',
//     marginLeft: 10,
//   },
//   selectTimeButton: {
//     backgroundColor: '#5cb85c',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginVertical: 20,
//     marginHorizontal: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   selectTimeButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   selectedTimeText: {
//     fontSize: 16,
//     marginTop: 10,
//     textAlign: 'center',
//     color: '#333',
//   },
//   calendar: {
//     borderRadius: 10,
//     elevation: 3,
//     marginHorizontal: 15,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   timeSlotButton: {
//     backgroundColor: '#f0f0f0',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     width: 250,
//     alignItems: 'center',
//   },
//   timeSlotText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   closeButton: {
//     backgroundColor: '#d9534f',
//     borderRadius: 10,
//     padding: 15,
//     elevation: 2,
//     marginTop: 15,
//     width: 250,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default OrganizationPage;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchOrgs, useUser } from '../../context/userContext';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import { getDatabase, ref as dbRef, update } from 'firebase/database';

const OrganizationPage = () => {
  const { orgName } = useLocalSearchParams();
  const { user, userLoading } = useUser();
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [orgImage, setOrgImage] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [connectStatus, setConnectStatus] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState({});

  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const time = 10 + i;
    return time.toString().padStart(2, '0') + ":00";
  });

  useEffect(() => {
    const loadOrgData = async () => {
      if (orgName) {
        try {
          const result = await fetchOrgs({ [orgName]: '' });
          if (result && result[orgName]) {
            setOrgData(result[orgName]);
            if (result[orgName].orgPic) {
              const storage = getStorage();
              const imageRef = storageRef(storage, result[orgName].orgPic);
              const url = await getDownloadURL(imageRef);
              setOrgImage(url);
            }
            setIsMember(user?.orgs ? Object.keys(user.orgs).includes(orgName) : false);
          } else {
            setError('Organization not found');
          }
        } catch (error) {
          console.error('Error fetching org data:', error);
          setError(error.message || 'An error occurred while fetching data');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No organization name provided');
        setLoading(false);
      }
    };

    loadOrgData();
  }, [orgName, user]);

  useEffect(() => {
    const generateUnavailableDates = () => {
      let unavailable = {};
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

      for (let i = 0; i < 10; i++) {
        const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
        const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${randomDay.toString().padStart(2, '0')}`;
        unavailable[dateString] = { disabled: true, marked: true, dotColor: 'red', disableTouchEvent: true };
      }
      setUnavailableDates(unavailable);
    };

    generateUnavailableDates();
  }, []);

  const handleDayPress = (day) => {
    if (unavailableDates[day.dateString]) return;
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const renderTimeSlot = ({ item }) => (
    <TouchableOpacity
      style={styles.timeSlotButton}
      onPress={async () => {
        setSelectedTimeSlot(item);
        setModalVisible(false);

        if (selectedDate) {
          const db = getDatabase();
          const userTimeRef = dbRef(db, `Users/${user.uid}/times`);
          await update(userTimeRef, { [orgName]: { [selectedDate]: item } });
        }
      }}
    >
      <Text style={styles.timeSlotText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleConnect = async () => {
    if (user && orgName) {
      // const db = getDatabase();
      // const userOrgRef = dbRef(db, `Users/${user.uid}/orgs`);
      // await update(userOrgRef, { [orgName]: true });
      // setIsMember(true);
      setConnectStatus(true);
    }
  };

  if (loading || userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
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

  if (!orgData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Organization not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: orgImage || 'https://via.placeholder.com/400x200' }}
        style={styles.orgImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.orgName}>{orgData.name}</Text>
          <Text style={styles.orgType}>{orgData.type}</Text>
          <Text style={styles.orgLocation}>{orgData.location}</Text>
        </LinearGradient>
      </ImageBackground>

      {orgData.description && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{orgData.description}</Text>
        </View>
      )}

      {(orgData.email || orgData.phone) && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {orgData.email && <Text style={styles.sectionText}>Email: {orgData.email}</Text>}
          {orgData.phone && <Text style={styles.sectionText}>Phone: {orgData.phone}</Text>}
        </View>
      )}

      {orgData.volunteerOpportunities && orgData.volunteerOpportunities.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Volunteer Opportunities</Text>
          {orgData.volunteerOpportunities.map((opportunity, index) => (
            <View key={index} style={styles.opportunityItem}>
              <Text style={styles.opportunityText}>• {opportunity}</Text>
            </View>
          ))}
        </View>
      )}

      {isMember ? (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select a Day to Volunteer</Text>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...unavailableDates,
              [selectedDate]: {
                selected: true,
                selectedDotColor: 'orange',
              },
            }}
            theme={{
              selectedDayBackgroundColor: '#5cb85c',
              todayTextColor: '#00adf5',
              arrowColor: '#5cb85c',
              dotColor: '#5cb85c',
              selectedDotColor: '#ffffff',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              monthTextColor: '#5cb85c',
            }}
            style={styles.calendar}
          />
          {selectedTimeSlot && (
            <Text style={styles.selectedTimeText}>Selected Time: {selectedTimeSlot}</Text>
          )}
        </View>
      ) : (
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
            disabled={connectStatus}
          >
            <Text style={styles.connectButtonText}>
              {connectStatus ? 'You have been connected' : 'Connect'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.connectStatusText}>
            {connectStatus ? 'You are now being looked at by the organization, now wait for approval' : 'press to connect with the'}
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select a Time Slot for {selectedDate}</Text>
          <FlatList
            data={timeSlots}
            renderItem={renderTimeSlot}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 50,
  },
  orgImage: {
    width: '100%',
    height: 250,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  orgName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  orgType: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 5,
  },
  orgLocation: {
    fontSize: 16,
    color: '#ddd',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  opportunityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  opportunityText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  connectButton: {
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectStatusText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  selectedTimeText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
  calendar: {
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 15,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  timeSlotButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 250,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#d9534f',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginTop: 15,
    width: 250,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrganizationPage;

