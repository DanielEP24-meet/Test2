// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput ,StyleSheet, ActivityIndicator, FlatList, Modal, TouchableOpacity } from 'react-native';
// import { useUser, fetchOrgs } from '../../context/userContext';
// import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
// import VolunteerActivity from '../../components/VolunteerActivity';

// const ViewAll = () => {
//   const [orgs, setOrgs] = useState([]);
//   const [filteredOrgs, setFilteredOrgs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterVisible, setFilterVisible] = useState(false);
//   const [selectedFilters, setSelectedFilters] = useState({
//     city: '',
//     volunteeringPosition: '',
//     name: '',
//   });

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
//                 requirements: org.requirements || '',
//                 skills: org.skills || '',
//                 image: imageUrl
//               };
//             }
//             return {
//               id,
//               org: org.name,
//               type: org.type || 'N/A',
//               location: org.location || 'N/A',
//               requirements: org.requirements || '',
//               skills: org.skills || '',
//               image: null
//             };
//           } catch (imageError) {
//             console.error('Error fetching image for org:', org.name, imageError);
//             return {
//               id,
//               org: org.name,
//               type: org.type || 'N/A',
//               location: org.location || 'N/A',
//               requirements: org.requirements || '',
//               skills: org.skills || '',
//               image: null
//             };
//           }
//         }));

//         setOrgs(orgsArray);
//         setFilteredOrgs(orgsArray);
//       } catch (error) {
//         console.error('Error fetching org data:', error);
//         setError(error.message);
//       }
//       setLoading(false);
//     };

//     loadOrgData();
//   }, []);

//   const filterOrgs = () => {
//     const filtered = orgs.filter(org => {
//       return (
//         (selectedFilters.city === '' || org.location.includes(selectedFilters.city)) &&
//         (selectedFilters.volunteeringPosition === '' || org.requirements.includes(selectedFilters.volunteeringPosition)) &&
//         (selectedFilters.name === '' || org.org.toLowerCase().includes(selectedFilters.name.toLowerCase()))
//       );
//     });
//     setFilteredOrgs(filtered);
//     setFilterVisible(false);
//   };

//   const renderItem = ({ item }) => <VolunteerActivity key={item.id} {...item} />;

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
//     <View style={styles.container}>
//       <View style={[styles.headerContainer, styles.stickyHeader]}>
//         <Text style={styles.headerText}>View All</Text>
//         <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterButton}>
//           <Text style={styles.filterButtonText}>Filter</Text>
//           <Text style={styles.filterButtonText}>▼</Text>
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={filteredOrgs}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.orgList}
//       />
//       <Modal
//         visible={filterVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setFilterVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Filter Options</Text>
//             <View style={styles.filterOptionContainer}>
//               <Text style={styles.filterOptionLabel}>City:</Text>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.city === 'Jerusalem' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Jerusalem' })}
//               >
//                 <Text style={styles.filterOptionText}>Jerusalem</Text>
//                 {selectedFilters.city === 'Jerusalem' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.city === 'Tel Aviv' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Tel Aviv' })}
//               >
//                 <Text style={styles.filterOptionText}>Tel Aviv</Text>
//                 {selectedFilters.city === 'Tel Aviv' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.city === 'Haifa' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Haifa' })}
//               >
//                 <Text style={styles.filterOptionText}>Haifa</Text>
//                 {selectedFilters.city === 'Haifa' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.city === 'Petah Tikva' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Petah Tikva' })}
//               >
//                 <Text style={styles.filterOptionText}>Petah Tikva</Text>
//                 {selectedFilters.city === 'Petah Tikva' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.city === 'Nazareth' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Nazareth' })}
//               >
//                 <Text style={styles.filterOptionText}>Nazareth</Text>
//                 {selectedFilters.city === 'Nazareth' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//             <View style={styles.filterOptionContainer}>
//               <Text style={styles.filterOptionLabel}>Volunteering Position:</Text>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Serving food' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Serving food' })}
//               >
//                 <Text style={styles.filterOptionText}>Serving food</Text>
//                 {selectedFilters.volunteeringPosition === 'Serving food' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Cleaning' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Cleaning' })}
//               >
//                 <Text style={styles.filterOptionText}>Cleaning</Text>
//                 {selectedFilters.volunteeringPosition === 'Cleaning' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Legal work' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Legal work' })}
//               >
//                 <Text style={styles.filterOptionText}>Legal work</Text>
//                 {selectedFilters.volunteeringPosition === 'Legal work' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Packing Meals' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Packing Meals' })}
//               >
//                 <Text style={styles.filterOptionText}>Packing Meals</Text>
//                 {selectedFilters.volunteeringPosition === 'Packing Meals' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Patrol' && styles.selectedFilterOption]}
//                 onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Patrol' })}
//               >
//                 <Text style={styles.filterOptionText}>Patrol</Text>
//                 {selectedFilters.volunteeringPosition === 'Patrol' && (
//                   <Text style={styles.filterOptionText}>✓</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="Organization Name"
//               value={selectedFilters.name}
//               onChangeText={(text) => setSelectedFilters({ ...selectedFilters, name: text })}
//             />
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity style={styles.modalButton} onPress={filterOrgs}>
//                 <Text style={styles.modalButtonText}>Apply Filters</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.modalButton} onPress={() => setFilterVisible(false)}>
//                 <Text style={styles.modalButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput ,StyleSheet, ActivityIndicator, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useUser, fetchOrgs } from '../../context/userContext';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import VolunteerActivity from '../../components/VolunteerActivity';

const ViewAll = () => {
  const [orgs, setOrgs] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    city: '',
    volunteeringPosition: '',
    name: '',
  });

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
                requirements: org.requirements || '',
                skills: org.skills || '',
                image: imageUrl
              };
            }
            return {
              id,
              org: org.name,
              type: org.type || 'N/A',
              location: org.location || 'N/A',
              requirements: org.requirements || '',
              skills: org.skills || '',
              image: null
            };
          } catch (imageError) {
            console.error('Error fetching image for org:', org.name, imageError);
            return {
              id,
              org: org.name,
              type: org.type || 'N/A',
              location: org.location || 'N/A',
              requirements: org.requirements || '',
              skills: org.skills || '',
              image: null
            };
          }
        }));

        setOrgs(orgsArray);
        setFilteredOrgs(orgsArray);
      } catch (error) {
        console.error('Error fetching org data:', error);
        setError(error.message);
      }
      setLoading(false);
    };

    loadOrgData();
  }, []);

  const filterOrgs = () => {
    const filtered = orgs.filter(org => {
      if (org.org != null)
        {
          return (
            (selectedFilters.city === '' || org.location.includes(selectedFilters.city)) &&
            (selectedFilters.volunteeringPosition === '' || org.requirements.includes(selectedFilters.volunteeringPosition)) &&
            (selectedFilters.name === '' || org.org.toLowerCase().includes(selectedFilters.name.toLowerCase()))
          );
      } 
       
    });
    setFilteredOrgs(filtered);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setSelectedFilters({
      city: '',
      volunteeringPosition: '',
      name: '',
    });
  };

  const renderItem = ({ item }) => <VolunteerActivity key={item.id} {...item} />;

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
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.stickyHeader]}>
        <Text style={styles.headerText}>View All</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
          <Text style={styles.filterButtonText}>▼</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredOrgs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orgList}
      />
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <View style={styles.filterOptionContainer}>
              <Text style={styles.filterOptionLabel}>City:</Text>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.city === 'Jerusalem' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Jerusalem' })}
              >
                <Text style={styles.filterOptionText}>Jerusalem</Text>
                {selectedFilters.city === 'Jerusalem' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.city === 'Tel Aviv' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Tel Aviv' })}
              >
                <Text style={styles.filterOptionText}>Tel Aviv</Text>
                {selectedFilters.city === 'Tel Aviv' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.city === 'Haifa' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Haifa' })}
              >
                <Text style={styles.filterOptionText}>Haifa</Text>
                {selectedFilters.city === 'Haifa' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.city === 'Petah Tikva' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Petah Tikva' })}
              >
                <Text style={styles.filterOptionText}>Petah Tikva</Text>
                {selectedFilters.city === 'Petah Tikva' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.city === 'Nazareth' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, city: 'Nazareth' })}
              >
                <Text style={styles.filterOptionText}>Nazareth</Text>
                {selectedFilters.city === 'Nazareth' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.filterOptionContainer}>
              <Text style={styles.filterOptionLabel}>Volunteering Position:</Text>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Serving food' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Serving food' })}
              >
                <Text style={styles.filterOptionText}>Serving food</Text>
                {selectedFilters.volunteeringPosition === 'Serving food' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Cleaning' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Cleaning' })}
              >
                <Text style={styles.filterOptionText}>Cleaning</Text>
                {selectedFilters.volunteeringPosition === 'Cleaning' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Legal work' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Legal work' })}
              >
                <Text style={styles.filterOptionText}>Legal work</Text>
                {selectedFilters.volunteeringPosition === 'Legal work' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Packing Meals' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Packing Meals' })}
              >
                <Text style={styles.filterOptionText}>Packing Meals</Text>
                {selectedFilters.volunteeringPosition === 'Packing Meals' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, selectedFilters.volunteeringPosition === 'Patrol' && styles.selectedFilterOption]}
                onPress={() => setSelectedFilters({ ...selectedFilters, volunteeringPosition: 'Patrol' })}
              >
                <Text style={styles.filterOptionText}>Patrol</Text>
                {selectedFilters.volunteeringPosition === 'Patrol' && (
                  <Text style={styles.filterOptionText}>✓</Text>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Organization Name"
              value={selectedFilters.name}
              onChangeText={(text) => setSelectedFilters({ ...selectedFilters, name: text })}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={filterOrgs}>
                <Text style={styles.modalButtonText}>Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={resetFilters}>
                <Text style={styles.modalButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setFilterVisible(false)}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#8B0000',
    fontWeight: 'bold',
    marginRight: 5,
  },
  orgList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 70,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterOptionText: {
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterOptionText: {
    fontSize: 16,
  },
  filterOptionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  filterOptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedFilterOption: {
    backgroundColor: '#f0f4f8',
  },
  filterOptionText: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default ViewAll;