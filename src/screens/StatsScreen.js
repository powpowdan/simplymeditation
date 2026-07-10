import React, {useState, useRef} from 'react';
import {View, Text, Button, Alert, StyleSheet, Dimensions, ScrollView, LayoutAnimation, UIManager, Platform} from 'react-native';
import {useSessionContext} from '../context/SessionContext';
import {Calendar} from 'react-native-calendars';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function StatsScreen() {
  const {
    totalTimeMeditated,
    sessionCount,
    resetStatistics,
    resetShortestStatistics,
    longestTimeMeditated,
    shortestTimeMeditated,
    // for calendar:
    currentStreak, 
    longestStreak,
    meditationHistory,
  } = useSessionContext();

  const scrollViewRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Create the marked dates object for the calendar
  const markedDates = {};
  for (const dateString in meditationHistory) {
    if (Object.hasOwnProperty.call(meditationHistory, dateString)) {
      markedDates[dateString] = {
        marked: true,
        dotColor: '#74aff7',
      };
    }
  }
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#74aff7', //  color for the circle
      selectedTextColor: '#FFFFFF', //  day number is white
      dotColor: '#1A1F26', // Hide dot under selection circle
    };
  }

  // Utility function for formatting time
  const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);

    return (
      [
        hours && `${hours} ${hours === 1 ? 'hour' : 'hours'}`,
        minutes && `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`,
        seconds && `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`,
      ]
        .filter(Boolean)
        .join(' and ') || '0 seconds'
    );
  };

  const calculateAverageDuration = () =>
    sessionCount ? totalTimeMeditated / sessionCount : 0;

    const handleResetStatistics = () => {
      Alert.alert(
        'Confirm Reset',
        'Are you sure you want to reset all statistics?',
        [
          {text: 'Do not reset', style: 'cancel'},
          {text: 'Reset Shortest Only', onPress: resetShortestStatistics},
          {text: 'RESET ALL', onPress: resetStatistics, style: 'destructive'},
        ],
      );
    };

  const handleDayPress = day => {
    const dateString = day.dateString;
    // Allow selection only if the user has meditated on that day
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (meditationHistory[dateString]) {
      // Toggle selection off if the same day is pressed again
      const newSelectedDate = selectedDate === dateString ? null : dateString;
      setSelectedDate(newSelectedDate);

      // If we are selecting a new date, scroll to the bottom to show the info card
      if (newSelectedDate) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 100); //  small delay ensures the layout has updated before scrolling
      }
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.container}>
      {/* <Text style={styles.headerText}>Statistics</Text> */}

      {/* Streak Section */}
      <View style={styles.statBlock}>
        <Text style={styles.blockTitle}>Current Streak</Text>
        <Text style={styles.streakText}>{currentStreak || 0} Days</Text>
        <Text style={styles.subText}>Longest Streak: {longestStreak || 0} Days</Text>
      </View>

      {/* Lifetime Stats Section */}
      <View style={styles.statBlock}>
        <Text style={styles.blockTitle}>Lifetime Stats</Text>
        <Text style={styles.statText}>
          <Text style={styles.bold}>Total Time:</Text> {formatTime(totalTimeMeditated)}
        </Text>
        <Text style={styles.statText}>
          <Text style={styles.bold}>Total Sessions:</Text> {sessionCount}
        </Text>
        <Text style={styles.statText}>
          <Text style={styles.bold}>Average Duration:</Text> {formatTime(calculateAverageDuration())}
        </Text>
        <Text style={styles.statText}>
          <Text style={styles.bold}>Longest Session:</Text> {formatTime(longestTimeMeditated)}
        </Text>
        <Text style={styles.statText}>
          <Text style={styles.bold}>Shortest Session:</Text> {formatTime(shortestTimeMeditated)}
        </Text>
      </View>

      {/* Calendar Section */}
      <View style={styles.statBlock}>
        <Text style={styles.blockTitle}>Meditation History</Text>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            calendarBackground: '#1A1F26',
            dayTextColor: '#ffffff',
            monthTextColor: '#ffffff',
            textDisabledColor: '#555555',
            arrowColor: '#74aff7',
            todayTextColor: '#74aff7',
            textSectionTitleColor: '#a0a0a0',
            'stylesheet.calendar.header': {
              week: {marginTop: 5, flexDirection: 'row', justifyContent: 'space-around'}
            }
          }}
        />
        {selectedDate && meditationHistory[selectedDate] > 0 && (
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateText}>
              On {selectedDate}, you meditated for{' '}
              <Text style={styles.bold}>{formatTime(meditationHistory[selectedDate])}</Text>.
            </Text>
          </View>
        )}
      </View>
      {/* Reset Statistics Button */}
      <View style={styles.resetButtonContainer}>
        <Button title="Reset Statistics" onPress={handleResetStatistics} />
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const baseWidth = 411; // Pixel 4 XL baseline
const scale = width / baseWidth;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#212121',
  },
  container: {
    alignItems: 'center',
    padding: 20 * scale,
  },
  headerText: {
    fontSize: 24 * scale,
    color: '#ededed',
    paddingTop: 50 * scale,
    paddingBottom: 20 * scale, // Adjusted for consistency
    textAlign: 'center',
  },
  statBlock: {
    width: '100%',
    backgroundColor: '#1A1F26',
    borderRadius: 10 * scale,
    borderWidth: 0.8,
    borderColor: '#74aff7',
    padding: 15 * scale,
    marginBottom: 20 * scale,
  },
  blockTitle: {
    fontSize: 18 * scale,
    color: '#74aff7',
    fontWeight: 'bold',
    marginBottom: 10 * scale,
  },
  streakText: {
    fontSize: 32 * scale,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14 * scale,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 5 * scale,
  },
  statText: {
    color: '#ffffff',
    marginTop: 10 * scale,
  },
  options: {
    fontSize: 15 * scale,
    paddingTop: 20 * scale,
    marginBottom: 10 * scale,
  },
  bellOptions: {
    paddingTop: 20 * scale,
    marginBottom: 10 * scale,
  },
  bellContainer: {
    marginTop: 20 * scale,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10 * scale,
  },
  bellOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    color: '#ffffff',
    marginLeft: 10 * scale,
  },
  bold: {
    fontWeight: 'bold',
  },
  selectedDateInfo: {
    marginTop: 15 * scale,
    padding: 10 * scale,
    backgroundColor: '#272B30',
    borderRadius: 8 * scale,
  },
  selectedDateText: {
    color: '#FFFFFF',
    fontSize: 16 * scale,
    textAlign: 'center',
  },
  resetButtonContainer: {
    marginTop: 40 * scale,
  },
});

export default StatsScreen;
