import { StyleSheet,Dimensions } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'
import EStyleSheet from 'react-native-extended-stylesheet';
const { width, height } = Dimensions.get('window')
export default EStyleSheet.create({
  ...ApplicationStyles.screen,
  headerView: {
    backgroundColor:Colors.background,
    alignItems:'center',

  },
  containers : {
    marginLeft: 10,
    marginRight : 10,
    marginBottom : 20
  },
  navbarview: {
    marginTop:21,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
  },
  navbarview: {
   marginTop:21,
   //flex:1,
   flexDirection:'row',
 },
 navbarCenterView : {
   flex:1,
   alignItems:'center',
 },
  profileimage: {
  flex:3,
  alignItems:'center',
  alignSelf:'stretch',

  },
  userImage: {
    alignSelf:'center',
    height:85,
    width:85,
    margin:10,
    alignSelf:'center',
    borderRadius: 42.5,
  },
  modelText: {
    fontSize:10.4,
    fontFamily : Fonts.type.regular,
    lineHeight:17,
    letterSpacing:1.4,
    color:'rgb(102,102,102)',
    textAlign:'center',
    marginLeft : (width > 325) ? 35 : 20,
    marginRight : 35,
    marginTop:10,
  },
  searchBox : {
    fontFamily:Fonts.type.regular,
    fontSize:Fonts.size.regular,
    lineHeight:23,
    letterSpacing:1.8,
    height:(width >= 325) ? 45 : 40,
    width:"76%",
    color: 'rgba(102,102,102,0.5)',
    padding: (width >= 325) ? 10 : 7
  },
  filtertitles:{
    marginTop:(width >=325) ? 20 : 10,
    fontFamily:Fonts.type.bold,
    color:Colors.whiteMuted,
    fontSize:10,
    textAlign:'center',
    letterSpacing:0.5,
  },
  imageThumbnail : {
    height:(width - 36)/3,
    width :(width - 36)/3,
    borderRadius : 5,
    marginHorizontal:2,

  },
  imageCollection : {
    flexDirection:'row',
    flexWrap:'wrap',
    paddingTop :10,
    paddingHorizontal:(width >= 325) ? 10 : 10,
    justifyContent:'flex-start'
  },
  imageTouch : {
    height:(width - 36)/3,
    marginTop:10,
  },
  username : {
    fontFamily : Fonts.type.bold,
    fontSize : 14,
    lineHeight : 23,
    letterSpacing : 1.8,
    color : 'white',
    backgroundColor : 'transparent'
  },
  gymname : {
    fontFamily : Fonts.type.regular,
    fontSize : 16,
    letterSpacing : 2,
    lineHeight : 23,
    color : 'rgb(102,102,102)',
  },
  searchButtonView : {
    backgroundColor:'rgb(172,14,250)',
    width:30,
    height:30,
    borderRadius:100,
    marginTop:(width > 325) ? 7 : 5,
    marginRight:5,
    paddingRight:20
  },
  playIcon: {
    color:'rgb(172,14,250)',
    position:'absolute',
    top:(width > 325) ? 40 : 30,
    right:(width > 325) ? 40 : 31,
    backgroundColor:'transparent'
  },


})
