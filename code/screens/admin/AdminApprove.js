import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, get, remove, update } from "firebase/database";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const AdminApprove = () => {
  const [approvedStaffs, setApprovedStaffs] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const userId = useSelector(state => state.user.userId);
  const [loading, setLoading] = useState(true); // State for loading


  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const approvedStaffs = Object.keys(usersData)
            .filter(key => usersData[key].role === 'staff' && usersData[key].status === 'approved')
            .map(key => ({ ...usersData[key], userId: key }));
          const approvedAdmins = Object.keys(usersData)
            .filter(key => usersData[key].role === 'admin' && usersData[key].status === 'approved' && key !== userId)
            .map(key => ({ ...usersData[key], userId: key }));

          setApprovedStaffs(approvedStaffs);
          setApprovedAdmins(approvedAdmins);
        }
      } catch (error) {
        Alert.alert('Error Fetching Data', error.message);
      }
    };

    fetchApprovedUsers();
    setLoading(false);
  }, []);

  const confirmDeleteAdmin = (userId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this admin?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteAdminReq(userId),
          style: "destructive"
        }
      ]
    );
  };

  const confirmDeleteStaff = (userId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this staff?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteUser(userId),
          style: "destructive"
        }
      ]
    );
  };

const deleteAdminReq = async (userId) => {
    const userRef = ref(db, 'users/' + userId );
    await update(userRef, { 
      role: 'staff',
      status: 'approved' }
    );
    setApprovedAdmins(approvedAdmins.filter(user => user.userId !== userId)); // Update state to reflect deletion
    Alert.alert("Admin request denied successfuly.");
  };

const deleteUser = async (userId) => {
  const userRef = ref(db, 'users/' + userId );
  const supportiveMesRef = ref(db, 'supportivemessages/' + userId);
  await remove(userRef);
  await remove(supportiveMesRef);
  setApprovedStaffs(prevState => prevState.filter(user => user.userId !== userId)); // Update state to reflect deletion
};

const getDynamicFontSize = (name) => {
  const length = name.length;
  if (length <= 16) return 18;
  if ( 16 < length && length < 20 )  return 16;
  return 15;
};

if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

  return (
    <View style={styles.container}>
      <View style={styles.adminView}>
        <Text style={styles.title}>Approved Admin</Text>
        <ScrollView 
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                {approvedAdmins.map((admin, index) => (
                    <View key={index} style={styles.accContainer}>
                        <View>
                            <Text style={[styles.nameStyle, { fontSize: getDynamicFontSize(admin.name) }]}>{admin.name}</Text>
                            <Text>{admin.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonApprove} onPress={() => {confirmDeleteAdmin(admin.userId)}}>
                            <MaterialCommunityIcons name='delete-outline' color='red' size={30} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
      </View>
      <View style={styles.staffView}>
        <Text style={styles.title}>Approved Staff</Text>
        <ScrollView 
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                {approvedStaffs.map((staff, index) => (
                    <View key={index} style={styles.accContainer}>
                        <View>
                            <Text style={[styles.nameStyle, { fontSize: getDynamicFontSize(staff.name) }]}>{staff.name}</Text>
                            <Text>{staff.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonApprove} onPress={() => {confirmDeleteStaff(staff.userId)}}>
                            <MaterialCommunityIcons name='delete-outline' color='red' size={30} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Distribute space between the views
  },
  adminView: {
    justifyContent: 'flex-start', 
    alignItems: 'center',
    flex: 1, 
    borderColor: 'black',
    marginHorizontal: 10,
    marginVertical: 5,
    width: 350,
    borderRadius: 15,
    backgroundColor: '#fff', // Ensure background color for visibility of shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7, // Adds depth, shadows for Android
  },
  staffView: {
    justifyContent: 'flex-start', 
    alignItems: 'center',
    flex: 1, 
    marginHorizontal: 10,
    marginVertical: 10,
    width: 350,
    borderRadius: 15,
    backgroundColor: '#fff', // Ensure background color for visibility of shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7, // Adds depth, shadows for Android
  },
  accContainer: {
    backgroundColor: '#ECECEC',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    margin: 10,
    width: 300,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.3, // Slightly increased opacity for better visibility
    shadowRadius: 8, // Slightly increased radius for better visibility
    elevation: 7, // Slightly increased elevation for better visibility
},
nameStyle: {
    fontWeight: 'bold',
    width: 180
},
title: {
  fontFamily: 'CantataOne-Regular',
  fontSize: 20,
  marginTop: 10,
  marginBottom: 5
},
buttonApprove: {
    marginTop: 7,
    marginLeft: 10
},
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}
});

export default AdminApprove;
