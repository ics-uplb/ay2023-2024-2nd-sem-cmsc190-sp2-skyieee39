import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { db, auth as firebaseAuth  } from '../../firebase-config'; // Import your database configuration
import { useSelector } from 'react-redux';
import AppHeader from '../../components/AppHeader'
import { useNavigation } from '@react-navigation/native';

const AdProfile = () => {
    const navigation = useNavigation();
    const userName= useSelector(state => state.user.userName);
    const userContact = useSelector(state => state.user.userContact);
    const userPhoto = useSelector(state => state.user.photoUrl);
    const userEmail = useSelector(state => state.user.email);

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await firebaseAuth.signOut(); // Correct usage of firebaseAuth
            navigation.navigate('Login');
            Alert.alert("Signed out successfully!");
        } catch (error) {
            //console.error('Sign Out Error: ', error);
            Alert.alert('Sign Out Failed', error.message);
        }
    };
  return (
    <View style={styles.profileView}>
        <AppHeader />
        <View style={styles.profileContainer}>
          <View style={styles.imageView}>
            <Image
              source={{uri: userPhoto}} //? { uri: userImage } : require('./path/to/default-image.png')} // Provide a default image if userImage is null
              style={styles.image}
            />
          </View>
          <View style={styles.nameView}>
            <Text style={styles.name}> {userName ? userName : 'N/A'} </Text>
          </View>
          <View style={styles.contactView}>
            <Text style={styles.contactTitle}>Contact Details</Text>
            <Text style={styles.contactDetails}>Phone Number: {userContact ? userContact : 'N/A'}</Text>
            <Text style={styles.contactDetails}>Email: {userEmail ? userEmail : 'N/A'}</Text>
          </View>
          <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed ? '#942037' : '#B7505C' // Change background color when pressed
                        }
                    ]}
                    onPress={signOut}>
                        <Text style={styles.text}>Logout Account</Text>
          </Pressable>
          </View>
        </View>
  )
}
const styles = StyleSheet.create({
    profileContainer: {
        alignItems: 'center',
        marginTop: 30
    },
    profileView: {
      alignItems: 'center',
      verticalAlign:'middle'
    },
    imageView: {
      marginTop: 20,
      width: 200,
      height: 200,
      borderRadius: 100,
      overflow: 'hidden', // Ensures the image fits within the border radius
      shadowColor: 'black',
      shadowOffset: {
        width: 5,
        height: 10,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 5,
      borderColor: '#D5D5D580',
    },
    nameView: {
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      borderRadius: 10,
      margin: 20,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 14,
    },
    name: {
      fontFamily: 'CantataOne-Regular',
      fontSize: 20,
      margin: 10,
      textAlign: 'center'
    },
    contactView: {
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      borderRadius: 10,
      margin: 20,
      padding: 10,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 14,
    },
    contactTitle: {
      fontFamily: 'CantataOne-Regular',
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center'
    },
    contactDetails: {
      fontFamily: 'CantataOne-Regular',
      fontSize: 15,
      textAlign: 'center'
    },
    button: {
      marginTop: 20,
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
  })

export default AdProfile