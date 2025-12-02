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

// ✅ Use localhost for Web Mode (or your IP if on phone)
const API_URL = "http://localhost:3000/workouts";

export default function LogWorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (Platform.OS === "web") {
        // @ts-ignore
        setUserId(localStorage.getItem("userId"));
      } else {
        setUserId(await SecureStore.getItemAsync("userId"));
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      if (Platform.OS === "web") alert("Error: No user logged in");
      else Alert.alert("Error", "No user logged in");
      return;
    }

    try {
      await axios.post(API_URL, {
        userId,
        name: workoutName,
        exercises: [
          {
            name: exerciseName,
            sets: parseInt(sets),
            reps: parseInt(reps),
            weight: parseFloat(weight),
          },
        ],
      });

      if (Platform.OS === "web") alert("Workout Saved!");
      else Alert.alert("Success", "Workout Saved!");

      router.back(); // Go back to dashboard
    } catch (error) {
      console.error(error);
      if (Platform.OS === "web") alert("Failed to save");
      else Alert.alert("Error", "Failed to save workout");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Workout 🏋️</Text>

      <Text style={styles.label}>Workout Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Chest Day"
        placeholderTextColor="#666"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <Text style={styles.sectionTitle}>First Exercise</Text>

      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bench Press"
        placeholderTextColor="#666"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Sets</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
          />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Lbs</Text>
          <TextInput
            style={styles.input}
            placeholder="135"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Workout</Text>
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
  title: { fontSize: 32, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  sectionTitle: {
    fontSize: 22,
    color: "#4ADE80",
    marginBottom: 15,
    marginTop: 10,
  },
  label: { color: "#888", marginBottom: 5 },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
    // Removed outlineStyle to fix TypeScript error
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  col: { flex: 1, marginHorizontal: 5 },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  cancelButton: { padding: 15, alignItems: "center", marginTop: 10 },
  cancelText: { color: "#FF3B30", fontSize: 16 },
});
