
import { StyleSheet,Dimensions,Platform } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'
import EStyleSheet from 'react-native-extended-stylesheet';
const { width, height } = Dimensions.get('window')
export default EStyleSheet.create({
  ...ApplicationStyles.screen,
  container : {
    backgroundColor : '#fff',
    height : height
  },
  menuTopBekground : {
    width : '100%',
    backgroundColor : Colors.background,
  },
  usesrDeatils : {
    marginTop : 67,
    marginLeft : 24,
    marginBottom : 20,
    '@media (width: 320)': {
      marginTop : 57,
      marginLeft : 18,
      marginBottom : 20
    },
  },
  username : {
    fontSize:10, letterSpacing:0.6, color:"rgba(255,255,255,0.5)", marginTop:4
  },
  nav : {
    marginTop : 45,
    marginLeft : 41,
    marginRight : 41,
    '@media (width: 320)': {
      marginLeft : 20,
      marginRight : 20
    },
  },
  navItem : {
    borderBottomWidth : 0,
    marginBottom : 36,
  },
  naveItermborder : {
    borderBottomWidth:0
  },
  iconStyle : {
    fontSize : 22, color: 'rgb(102,102,102)'
  },
  bottomLogoutView : {
    position : 'absolute',
    bottom : (Platform.OS === 'ios') ? 0 : 20,
    width : "75%"
  },
})
