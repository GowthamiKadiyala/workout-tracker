import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:3000/schedule";

export default function ScheduleScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (Platform.OS === "web") {
        // @ts-ignore
        setUserId(localStorage.getItem("userId"));
      } else {
        setUserId(await SecureStore.getItemAsync("userId"));
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split("T")[0]);
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!title || !date) {
      if (Platform.OS === "web") alert("Fill in all fields");
      else Alert.alert("Error", "Fill in all fields");
      return;
    }

    try {
      await axios.post(API_URL, {
        userId,
        title,
        date: date,
      });

      if (Platform.OS === "web") alert("Scheduled!");
      else Alert.alert("Success", "Workout Scheduled!");

      router.back();
    } catch (error) {
      console.error(error);
      if (Platform.OS === "web") alert("Failed to save");
      else Alert.alert("Error", "Failed to save");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plan Workout 📅</Text>

      <Text style={styles.label}>Workout Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Leg Day"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-12-01"
        placeholderTextColor="#666"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Schedule It</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 50,
  },
  title: { fontSize: 32, color: "#fff", fontWeight: "bold", marginBottom: 30 },
  label: { color: "#888", marginBottom: 5 },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#A855F7",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  cancelButton: { padding: 15, alignItems: "center", marginTop: 10 },
  cancelText: { color: "#FF3B30", fontSize: 16 },
});
