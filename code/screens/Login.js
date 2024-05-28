import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect } from 'react';
import { Alert, View, StyleSheet, Text, Image, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import { db, auth as firebaseAuth  } from '../firebase-config'; // Import your database configuration
import { set, ref, get } from "firebase/database";
import { useDispatch } from 'react-redux';
import { setUserId, setUserName, setContactDetails, setUserPhoto, setEmail } from '../features/user/userSlice';

const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const emailRegex = /@up\.edu\.ph$/

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '261567700509-dhtg71ueu9h6jsf3dsga81fmqqebu4cb.apps.googleusercontent.com',
        });
    
        const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                const userId = user.uid;
                dispatch(setUserId(userId));
            }
        });
    
        return () => unsubscribe();
    }, []);

    function initializeUserJournal(userId) {
        set(ref(db, 'journals/' + userId), {
        }).then(() => {
            console.log("Journal collection initialized successfully!");
        }).catch((error) => {
            console.error("Failed to initialize journal collection: ", error);
        });
    }

    async function onGoogleButtonPress(role) {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const result = await auth().signInWithCredential(googleCredential);
            
            const userId = result.user.uid;
            const email = result.user.email;
            const userName = result.user.displayName;
            const userContact = result.user.phoneNumber;
            const userPhoto = result.user.photoURL;
            
            if (emailRegex.test(email) === true) {
                dispatch(setUserId(userId));
                dispatch(setEmail(email));
                dispatch(setUserName(userName));
                dispatch(setContactDetails(userContact));
                dispatch(setUserPhoto(userPhoto));
        
                const userRef = ref(db, 'users/' + userId);
                const snapshot = await get(userRef);
        
                if (!snapshot.exists()) {
                    await set(userRef, {
                        name: userName,
                        email: email,
                        role: role, // Set role to 'user' or 'staff'
                        status: role === 'staff' ? 'pending' : 'approved' // Default status for staff is 'pending'
                    });

                    if (role === 'user') {
                        await initializeUserJournal(userId);
                        Alert.alert("Signed in successfully!");
                        navigation.navigate('User'); 
                    }
                    else {
                        Alert.alert('Pending approval for staff account', 'Please wait for at least an hour for approval before signing in your account');
                        await GoogleSignin.revokeAccess();
                        await GoogleSignin.signOut();
                        navigation.navigate('Login');
                    }
                } else {
                    const userData = snapshot.val();
                    const role = userData.role;
                    const status = userData.status;

                    if (role === 'staff' && status === 'pending') {
                        Alert.alert('Pending approval for staff account', 'Please wait for at least an hour for approval before signing in your account');
                        await GoogleSignin.revokeAccess();
                        await GoogleSignin.signOut();
                        navigation.navigate('Login');
                    } else if(role === 'staff' && status === 'approved') {
                        Alert.alert("Signed in successfully!");
                        navigation.navigate('Staff');
                    } else if(role === 'user') {
                        Alert.alert("Signed in successfully!");
                        navigation.navigate('User');
                    } else if(role === 'admin' && status === 'pending') {
                        Alert.alert('Pending approval for admin account', 'Please wait for at least an hour for approval before signing in your account');
                        await GoogleSignin.revokeAccess();
                        await GoogleSignin.signOut();
                    } else {
                        Alert.alert("Signed in successfully!");
                        navigation.navigate('Admin');
                    }
                }
            }

            else {
                Alert.alert('Sign-in Failed', 'Please use your UP mail.')
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                navigation.navigate('Login');
            }
            
        } catch (error) {
            console.error('Login Failed: ', error); // Log the full error
            Alert.alert('Login Failed', error.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.whiteBox}>
                <Text style={styles.title}>UPLB Muni</Text>
                <View style={styles.formContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            {
                                backgroundColor: pressed ? '#942037' : '#B7505C' // Change background color when pressed
                            }
                        ]}
                        onPress={() => onGoogleButtonPress('staff')}>
                            <Text style={styles.text}>Register as Staff</Text>
                    </Pressable>
                    <View style={styles.buttonSpacer} />
                    <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed ? '#942037' : '#B7505C' // Change background color when pressed
                        }
                    ]}
                    onPress={() => onGoogleButtonPress('user')}>
                        <Text style={styles.text}>Sign in with Google Account</Text>
                    </Pressable>
                </View>
                <View style={styles.imageView}>
                    <Image style={styles.imageContainer}
                    // resizeMode="center"  
                    source={require('../assets/images/uplboble.jpg')} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#B7505C",
    },
    whiteBox: {
        flex: 1,
        backgroundColor: 'white', // White color for the overlay
        marginTop: -10,
        paddingTop: 10,
        margin: -150,
        marginBottom: 80,
        borderBottomLeftRadius: 350,
        borderBottomRightRadius: 350,
        
    },
    title: {
        fontFamily:'CantataOne-Regular',
        fontSize: 45,
        textAlign: 'center', // Center the title
        marginTop: 10,
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60
    },
    buttonSpacer: {
        height: 10, // Adjust this value as needed to increase/decrease space between the buttons
    },
    imageView: {
        marginTop: 200,
        marginBottom: -25
    },
    imageContainer: {
        position: "absolute",
        bottom: 0,
        width: 340, // Adjust the width as needed
        height: 340, // Adjust the height as needed
        borderRadius: 170, // Half of the width and height to make it circular
        alignSelf: "center",
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: "#B7505C",
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },

});

export default Login;