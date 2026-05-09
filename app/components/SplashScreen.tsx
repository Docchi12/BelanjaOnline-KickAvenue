import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  // Animasi muncul pelan-pelan (fade in)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // Muncul selama 1.5 detik
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient colors={['#0c5394', '#007AFF']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- INI BAGIAN YANG KAMU TANYAKAN --- */}
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>KA</Text> 
        </View>
        <Text style={styles.brandName}>KICK AVENUE</Text>
        <Text style={styles.tagline}>Authentic Footwear Marketplace</Text>
      </Animated.View>
      {/* ------------------------------------- */}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Official Mobile App</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logoCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 10, // Efek bayangan di Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoText: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#007AFF' 
  },
  brandName: { 
    color: '#fff', 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginTop: 20, 
    letterSpacing: 4 
  },
  tagline: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 12, 
    marginTop: 8, 
    letterSpacing: 1 
  },
  footer: { 
    position: 'absolute', 
    bottom: 50 
  },
  footerText: { 
    color: 'rgba(255,255,255,0.4)', 
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2
  }
});