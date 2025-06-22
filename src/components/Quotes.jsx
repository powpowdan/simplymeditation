import {useState, useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import {View, StyleSheet, Dimensions } from 'react-native';

const sentences = [
  'Be the change that you wish to see in the world',
  'Peace is not found in the world but in the quiet spaces within',
  'The future depends on what you do today',
  'The quieter you become, the more you can hear',
  'When you realize nothing is lacking, the whole world belongs to you',
  'To the mind that is still, the whole universe surrenders',
  'The only real failure in life is not to be true to the best one knows',
  'Meditation makes you accident-prone to enlightenment',
  'Greatness is not just what one does, but also what one refuses to do',
  'Meditate for twenty minutes every day, unless you’re too busy - then Meditate for an hour',
  'Continuous improvement is better than delayed perfection',
  'Simplicity, patience, compassion. These three are your greatest treasures',
  'The wise man is one who, knows, what he does not know',
  'When I let go of what I am, I become what I might be',
  'Knowing others is wisdom, knowing yourself is Enlightenment',
  'Continuous improvement is better than delayed perfection',
  'Do you have the patience to wait until your mud settles and the water is clear?',
  'He who is contented is rich',
  'Your work is to discover your world and then with all your heart give yourself to it',
  'The soul always knows what to do to heal itself. The challenge is to silence the mind',
  "The moment you accept what troubles you've been given, the door will open",
  'To enjoy the rainbow, first enjoy the rain',
  "You can't have a rainbow without a little rain",
  'Life will give you whatever experience is most helpful for the evolution of your consciousness',
  'Acknowledging the good that you already have in your life is the foundation for all abundance',
  'The moment you start watching the thinker, a higher level of consciousness becomes activated',
  'Worry pretends to be necessary but serves no useful purpose',
];


const Quotes = () => {
  const [availableIndexes, setAvailableIndexes] = useState([...Array(sentences.length).keys()]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(null);
  const [lastSentenceIndex, setLastSentenceIndex] = useState(null);
  const [animation, setAnimation] = useState('fadeIn');

  useEffect(() => {
    // Select a random index from availableIndexes
    const getRandomSentenceIndex = () => {
      if (availableIndexes.length === 0) {
        // Refresh the list when all quotes have been shown
        setAvailableIndexes([...Array(sentences.length).keys()]);
      }
 
      const randomIndex = Math.floor(Math.random() * availableIndexes.length);
      const index = availableIndexes[randomIndex];
      setAvailableIndexes(prev => prev.filter(i => i !== index)); // Remove selected index
      return index;
    };

    const timer = setInterval(() => {
      setAnimation('fadeOut'); // Fade out first
      setTimeout(() => {
        setCurrentSentenceIndex(prevCurrentIndex => {
          const newIndex = getRandomSentenceIndex();
          setLastSentenceIndex(prevCurrentIndex);
          setAnimation('fadeIn'); // Reset to fadeIn
          return newIndex;
        });
      }, 1000); // Smoother transition time
    }, 7000); // Change quote every 7 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, [availableIndexes]);

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <View>
      <Animatable.Text
        style={styles.instructions}
        animation={animation}
        duration={1000}>
        {currentSentence}
      </Animatable.Text>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  instructions: {
    height: height * 0.06,          // ~40px on typical screens
    textAlign: 'center',
    color: '#ededed',
    marginBottom: height * 0.010,   // ~15px
    marginTop: height * 0.015,      // ~10px
    paddingHorizontal: width * 0.03, // ~10px
    fontSize: width * 0.035,        // added for better scaling text size
  },
});

export default Quotes;
