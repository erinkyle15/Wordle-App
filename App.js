import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, CLEAR, ENTER } from './src/constants';
import Keyboard from './src/components/Keyboard/Keyboard';
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

export default function App() {

  const word = "hello";
  const letters = word.split('');

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const onKeyPressed = (key) => {
    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if(prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      } 
      return;
    }  

    if (key === ENTER) {
      if(curCol === rows[0].length){
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }  

    if (curCol < rows[0].length){
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  }

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  }

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if(row >= curRow) {
      return colors.black;
    }
    if(letter === letters[col]) {
      return colors.primary;
    }
    if(letters.includes(letter)){
      return colors.secondary;
    }
    return colors.darkgrey;
  }

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => 
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps =getAllLettersWithColor(colors.darkgrey);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>

        <ScrollView style={styles.map}>
          {rows.map((row, i) => (
            <View key={`row-${i}`} style={styles.row}>
              {row.map((cell, j) => (
                <View 
                  key={`cell-${i}-${j}`}
                  style={[
                    styles.cell, 
                    {
                      borderColor: isCellActive(i, j) 
                        ? colors.grey 
                        : colors.darkgrey,
                      backgroundColor: getCellBGColor(i, j),
                    },
                  ]}
                >
                  <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
        
      <Keyboard 
        onKeyPressed={onKeyPressed} 
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
    marginTop: 20,
    justifyContent: 'center',
  },
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
    height: 100,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});
