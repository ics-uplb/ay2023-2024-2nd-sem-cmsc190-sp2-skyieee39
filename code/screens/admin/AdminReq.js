import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, get, update } from "firebase/database";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminReq = () => {
  const [pendingAdmin, setPendingAdmin] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        const fetchPendingAdmin = async () => {
            const usersRef = ref(db, 'users');
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const pending = Object.keys(usersData)
                    .filter(key => usersData[key].role === 'admin' && usersData[key].status === 'pending')
                    .map(key => ({ ...usersData[key], userId: key }));
                    setPendingAdmin(pending);
            }

        };

        fetchPendingAdmin();
        setLoading(false);
    }, []);

    const approveAdmin = async (userId) => {
        const userRef = ref(db, 'users/' + userId);
        await update(userRef, { status: 'approved' });
        setPendingAdmin(pendingAdmin.filter(user => user.userId !== userId));
        Alert.alert("Admin approved successfully!");
    };

    const confirmDeleteRequest = (userId) => {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this request?",
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

    const deleteAdminReq = async (userId) => {
        const userRef = ref(db, 'users/' + userId );
        await update(userRef, { 
          role: 'staff',
          status: 'approved' }
        );
        setPendingAdmin(pendingAdmin.filter(user => user.userId !== userId)); // Update state to reflect deletion
        Alert.alert("Admin request denied successfuly.");
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
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                {pendingAdmin.map((admin, index) => (
                    <View key={index} style={styles.accContainer}>
                        <View>
                            <Text style={[styles.nameStyle, { fontSize: getDynamicFontSize(admin.name) }]}>{admin.name}</Text>
                            <Text>{admin.email}</Text>
                        </View>
                        <View style={styles.buttonContainer}> 
                            <TouchableOpacity style={styles.buttonApprove} onPress={() => approveAdmin(admin.userId)}>
                                <MaterialCommunityIcons name='check-circle-outline' color='green' size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDelete} onPress={() => confirmDeleteRequest(admin.userId)}>
                                <MaterialCommunityIcons name='close-circle-outline' color='red' size={33} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FFF',
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
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  nameStyle: {
      fontWeight: 'bold',
      width: 180
  },
  buttonApprove: {
      marginTop: 7,
      marginLeft: 10
  },
  buttonDelete: {
      marginTop: 5,
      marginLeft: 10
  },
  item: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default AdminReq