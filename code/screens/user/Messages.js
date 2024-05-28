import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, onValue } from "firebase/database";
import { useSelector } from 'react-redux';
import StudentChat from './StudentChat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Messages = () => {
    const [counsellingRequests, setCounsellingRequests] = useState({});
    const [expandedStaff, setExpandedStaff] = useState({});
    const [staffs, setStaffs] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [userChat, setUserChat] = useState({});
    const [staffId, setStaffId] = useState(null);
    const userEmail = useSelector(state => state.user.email);
    const uid = useSelector(state => state.user.userId);

    useEffect(() => {
        const requestsRef = ref(db, 'counsellingrequests/' + uid);
        const unsubscribe = onValue(requestsRef, (snapshot) => {
            const data = snapshot.val();
            const groupedRequests = {};

            for (const request in data) {
                if (data[request].status === 'relayed') {
                    const assignedStaff = data[request].assignedstaff;

                    if (!groupedRequests[assignedStaff]) {
                        groupedRequests[assignedStaff] = [];
                    }

                    groupedRequests[assignedStaff].push(data[request]);
                }
            }

            setCounsellingRequests(groupedRequests);
        }, {
            onlyOnce: false
        });

        const usersRef = ref(db, 'users');
        const usersUnsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const staffUsers = {};

            for (const staff in data) {
                if (data[staff].role === 'staff') {
                    const { name, email } = data[staff];
                    staffUsers[staff] = { name, email };
                }
            }

            setStaffs(staffUsers);
        }, {
            onlyOnce: false
        });

        // Clean up the subscription on unmount
        return () => {
            unsubscribe();
            usersUnsubscribe();
        };
    }, []);

    const getDynamicFontSize = (name) => {
        const length = name.length;
        if (length <= 16) return 20;
        if (16 < length && length < 20) return 18;
        return 17;
    };

    const toggleExpandStaff = (staffId) => {
        setExpandedStaff(prevState => ({
            ...prevState,
            [staffId]: !prevState[staffId]
        }));
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                {Object.keys(counsellingRequests).map((staffId) => {
                    const staffInfo = staffs[staffId];
                    return (
                        <View key={staffId} style={styles.card}>
                            <TouchableOpacity onPress={() => toggleExpandStaff(staffId)}>
                                <View style={styles.header}>
                                    <Text style={[styles.title, { fontSize: getDynamicFontSize(staffInfo?.name || staffId) }]}>
                                        {staffInfo ? staffInfo.name : 'Unknown Staff'}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        setUserChat(staffs[staffId]);
                                        setStaffId(staffId);
                                        setModalVisible(true);
                                    }}>
                                        <MaterialCommunityIcons name='chat' color='black' size={35} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.email}>
                                    {staffInfo ? staffInfo.email : 'No Email Available'}
                                </Text>
                            </TouchableOpacity>
                            {expandedStaff[staffId] && (
                                <View>
                                    {counsellingRequests[staffId].map((request, index) => (
                                        <View key={`${request.id}-${index}`} style={styles.requestContainer}>
                                            <Text style={styles.requestTitle}>
                                                Request {index + 1}
                                            </Text>
                                            <Text style={styles.text}>
                                                {request.notes}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
            <SafeAreaView>
              <Modal
                animationType="slide"
                visible={modalVisible}
              >
                <SafeAreaView style={{ flex: 1, backgroundColor:'#d9d9d9' }}>
                    <StudentChat closeModal={setModalVisible} otherUser={userChat} staffId={staffId}/>
                </SafeAreaView>
              </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 18,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 14,
        width: 300,
        margin: 20
    },
    header: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: 'CantataOne-Regular',
        color: 'black',
        width: 210,
    },
    email: {
        color: 'grey',
        fontSize: 13
    },
    requestContainer: {
        marginTop: 10,
    },
    requestTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#444444',
    },
    text: {
        fontSize: 15,
        color: '#444444',
        marginTop: 5,
    },
});

export default Messages;
