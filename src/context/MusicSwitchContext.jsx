import React, {
  createContext,
  useContext, 
  useMemo, 
} from 'react';
import useAsyncStorage from '../hooks/useAsyncStorage'; // Import the custom hook


const MusicSwitchContext = createContext();

export function MusicSwitchProvider({children}) {
  const [musicSwitchState, setMusicSwitchState] = useAsyncStorage(
    'musicSwitchState',
    false,
  );
  const [intervalBellsSwitchState, setIntervalBellsSwitchState] =
    useAsyncStorage('intervalBellsSwitchState', false);
  const [interval25Active, setInterval25Active] = useAsyncStorage(
    'interval25Active',
    false,
  );
  const [interval50Active, setInterval50Active] = useAsyncStorage(
    'interval50Active',
    false,
  );
  const [interval75Active, setInterval75Active] = useAsyncStorage(
    'interval75Active',
    false,
  );
  const [interval90Active, setInterval90Active] = useAsyncStorage(
    'interval90Active',
    false,
  );
  const [adjustmentSwitchState, setAdjustmentSwitchState] = useAsyncStorage(
    'adjustmentSwitchState',
    false,
  );
  const [adjustmentValue, setAdjustmentValue] = useAsyncStorage(
    'adjustmentValue',
    0,
  );
  const [selectedTone, setSelectedTone] = useAsyncStorage(
    'selectedTone',
    'audio_file.mp3',
  ); 
  const [selectedIntervalTone, setIntervalSelectedTone] = useAsyncStorage(
    'selectedIntervalTone',
    'intervalbell.mp3', 
  ); 

  const [selectedBgTone, setBgSelectedTone] = useAsyncStorage(
    'selectedBgTone',
    'intervalbell.mp3',
  );  

  //Chime, combine!
  const [selectedChimePath, setSelectedChimePath] = useAsyncStorage(
    'selectedChimePath',
    'Default',
  ); 

  const [selectedChimeName, setSelectedChimeName] = useAsyncStorage(
    'selectedChimeName',
    'Default',
  );   

  const [volume, setVolume] = useAsyncStorage(
    'volume',
      1,
  ); 
 
  const [savedChime, setSavedChime] = useAsyncStorage(
    'savedChime',
    JSON.stringify({ chime: 'empty', volume: 0.8 }), // To store the saved chime(path) and volume
  );

    //bgMusicSelector

    const [selectedSongPathBg, setselectedSongPathBg] = useAsyncStorage(
      'selectedSongPathBg',
      "empty",
    ); 
 
    const [selectedChimeNameBg, setSelectedChimeNameBg] = useAsyncStorage(
      'selectedChimeNameBg',
      'None',
    );   
  
    const [volumeBg, setVolumeBg] = useAsyncStorage(
      'volumeBg',
        1,
    ); 
   
    const [savedChimeBg, setSavedChimeBg] = useAsyncStorage(
      'savedChimeBg',
      JSON.stringify({ chime: 'empty', volume: 0.8 }), // To store the saved chime(path) and volume
    );

     //intervalSelector

     const [savedChimeIsouPath, setSavedChimeIsouPath] = useAsyncStorage(
      'savedChimeIsouPath',
      'empty'
    );

     const [selectedChimeNameIsou, setSelectedChimeNameIsou] = useAsyncStorage(
      'selectedChimeNameBg',
      'None',
    );   
  
    const [volumeIsou, setVolumeIsou] = useAsyncStorage(
      'volumeIsou',
        1,
    ); 
   
    const [savedChimeIsou, setSavedChimeIsou] = useAsyncStorage(
      'savedChimeIsou',
      JSON.stringify({ chime: 'DefaultISOU', volume: 0.8 }), // To store the saved chime(path) and volume
    );

    
  
    
  

  const toggleInterval25 = () => {
    setInterval25Active(!interval25Active);
  };

  const toggleInterval50 = () => {
    setInterval50Active(!interval50Active);
  };

  const toggleInterval75 = () => {
    setInterval75Active(!interval75Active);
  };

  const toggleInterval90 = () => {
    setInterval90Active(!interval90Active);
  };

  const toggleAdjustmentSwitch = () => {
    setAdjustmentSwitchState(!adjustmentSwitchState);
  };

  const setAdjustment = value => {
    setAdjustmentValue(value);
  };

  const contextValue = useMemo(() => {
    return {
      musicSwitchState,
      setMusicSwitchState,
      intervalBellsSwitchState,
      setIntervalBellsSwitchState,
      interval25Active,
      toggleInterval25,
      interval50Active,
      toggleInterval50,
      interval75Active,
      toggleInterval75,
      interval90Active,
      toggleInterval90,
      adjustmentSwitchState,
      toggleAdjustmentSwitch,
      adjustmentValue,
      setAdjustment,
      selectedTone,
      setSelectedTone, 
      selectedIntervalTone,
      setIntervalSelectedTone,
      selectedBgTone,
      setBgSelectedTone,

      selectedChimeName,
      setSelectedChimeName,
      volume,
      setVolume,
      savedChime,
      setSavedChime,

      selectedChimePath,
      setSelectedChimePath,

      selectedSongPathBg,
      setselectedSongPathBg,

      selectedChimeNameBg,
      setSelectedChimeNameBg,
      volumeBg,
      setVolumeBg,
      savedChimeBg,
      setSavedChimeBg,

      
      selectedChimeNameIsou,
      setSelectedChimeNameIsou,
      volumeIsou,
      setVolumeIsou,
      savedChimeIsou,
      setSavedChimeIsou,

      savedChimeIsouPath,
      setSavedChimeIsouPath,
    };
  }, [
    musicSwitchState,
    intervalBellsSwitchState,
    interval25Active,
    interval50Active,
    interval75Active,
    interval90Active,
    adjustmentSwitchState,
    adjustmentValue,
    selectedTone,
    selectedIntervalTone,
    selectedBgTone,

    selectedChimePath,
    selectedChimeName, 
    volume,
    savedChime,
     
    selectedSongPathBg,
    volumeBg,
    savedChimeBg,
    selectedChimeNameBg,

    savedChimeIsouPath,
    volumeIsou,
    savedChimeIsou,
    selectedChimeNameIsou,

  ]);

  return (
    <MusicSwitchContext.Provider value={contextValue}>
      {children}
    </MusicSwitchContext.Provider>
  );
}

export function useMusicSwitchContext() {
  const context = useContext(MusicSwitchContext);
  if (!context) {
    throw new Error(
      'useMusicSwitchContext must be used within a MusicSwitchProvider',
    );
  }
  return context;
}
