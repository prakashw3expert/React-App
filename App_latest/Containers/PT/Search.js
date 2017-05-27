// @flow

import React from 'react'
import { ScrollView, Text, Image, View,Switch,Dimensions,Modal,TouchableHighlight,Slider,StatusBar } from 'react-native'
import { Container, Content,Input,Form,Item,Body, ListItem,Icon,Grid,Col,Thumbnail,List,Button,Card, CardItem,Label,Left,Right,Tabs,Tab,TabHeading, } from 'native-base';
import { Images,Colors,Fonts } from '../../Themes'
import { Actions as NavigationActions } from 'react-native-router-flux'
import styles from './Styles/SearchScreenStyle'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RoundedButton from '../../Components/RoundedButton'
import Hr from 'react-native-hr'
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux'
import {api} from  "../../Services/Api"
import { call, put, takeEvery, takeLatest} from 'redux-saga/effects'
const timer = require('react-native-timer');
class SearchScreen extends React.Component {


  constructor(props) {
         super(props);
         this.state = {
             result: {},
             modalVisible: false,
         }
     }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentWillMount () {
    console.log('access token at search screen pt : ',this.props.user.accessToken)
   api.clientSearch(this.props.user.accessToken)
    .then((response) => {
       this.setState({result : response.data})
         console.log('response Main Search for Client: ', this.state.result)
    })
  }

  render () {
    return (

      <View style={styles.mainContainer}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.background}/>

        <ScrollableTabView
              locked={true}
              tabBarStyle={{borderWidth:0, height:40}}
              tabBarBackgroundColor={Colors.background}
              tabBarActiveTextColor={Colors.white}
              tabBarInactiveTextColor={Colors.whiteMuted}
              tabBarUnderlineStyle={styles.tabBorderSytel}
              tabBarTextStyle={[styles.tabText]}
              tabBarTabStyle={{paddingBottom:0}}
              renderTabBar={() => <DefaultTabBar />}>

              <ListView tabLabel='List View' users={this.state.result}/>
              <MapViewTab tabLabel='Map View' users={this.state.result}/>

            </ScrollableTabView>
            <Button onPress={() => {this.setModalVisible(!this.state.modalVisible)}}
                  style={Fonts.style.filterbutton}>
              <MaterialCommunityIcons name="filter-outline" size={28} size={(width >= 375) ? 28 : 20} style={{color:'white',marginTop:5,}}/>
          </Button>

          <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {this.setModalVisible(!this.state.modalVisible)}}>
               <Container>
                  <View style={styles.headerView}>
                    <View style={styles.navbarview}>
                      <View style={{flex:1}}>
                        <Button transparent iconLeft onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                          <MaterialCommunityIcons name="close" size={28} style={{color:'white'}}/>
                        </Button>
                      </View>
                      <View style={styles.navbarCenterView}>
                          <Text style={[Fonts.style.h1,Fonts.style.textWhite,{textAlign:'center'}]}> FILTER </Text>
                      </View>
                      <View style={{flex:1}}>
                      <Button transparent>
                          <Text></Text>
                      </Button>
                      </View>

                  </View>
                </View>

                <Filter />

            </Container>
          </Modal>

        </View>
    )
  }
}



class ListView extends React.Component {

  constructor(props) {
         super(props);
         this.state = {
             users: {}
         }
     }

componentWillReceiveProps ( props) {
  this.setState({users : props.users})
}

 render () {

   return (

         <Content disableKBDismissScroll={true}>
            <View style={styles.searchView}>
              <View style={[Fonts.style.inputWrapperBordered, {paddingRight:5}]}>
                      <Input returnKeyType='search' style={Fonts.style.inputBordered} placeholder='SEARCH FOR CLIENT ' placeholderTextColor={Fonts.colors.input}/>
                      <View style={{backgroundColor:'rgb(172,14,250)', width:30,height:30, borderRadius:100, marginTop:6, paddingRight:20}}><Icon name='search' style={Fonts.style.borderedIconRight} /></View>
                </View>
            </View>

            <DataListView users={this.props.users}/>

          {/*<Button onPress={() => {this.setModalVisible(!this.state.modalVisible)}}
                            style={Fonts.style.filterbutton}>
                        <MaterialCommunityIcons name="filter-outline" size={(width >= 375) ? 28 : 20} style={{color:'white',marginTop:5}}/>
                    </Button>*/}

         </Content>



   )
 }
}

class DataListView extends React.Component {

  constructor(props) {
         super(props);
         this.state = {
             result: Object
         }
     }

     navigateToDetails(item) {
      // if(item.working){
          NavigationActions.clientDetails({ clientData : item})
      //  }
      //  else{
      //    NavigationActions.ClientDetailNotWorking()
      //  }

     }

     componentWillReceiveProps (props) {


     }

     render () {
        return (

          <View>
            <Text style={styles.listViewTitle}>
              Found {this.props.users.length} clients nearby
            </Text>
            <View style={styles.separater}>
                <Hr lineColor={Colors.separetorLineColor}/>
            </View>
            <Content style={{marginBottom:20}}>
               <List dataArray={this.props.users} renderRow={(item) =>
                        <ListItem button avatar onPress={() => this.navigateToDetails(item)} style={{marginTop:(width >= 375) ? 14 : 10,paddingBottom:(width >= 375) ? 14 : 10, borderBottomWidth:1, borderColor:'rgb(234, 234, 234)', marginRight:(width >= 375) ? 20 : 10}}>
                            <Left>
                              <View>
                                 <Image source={require('../../Images/dummy/user4.jpeg')} style={styles.listImage}/>
                                 <View style={(item.online === true) ? Fonts.style.onlineDotMessages : Fonts.style.offlineDotMessages}></View>
                              </View>
                            </Left>
                            <Body style={{borderBottomWidth:0}}>
                              <Text style={styles.listname}>{item.name}</Text>
                              <Text style={styles.listAddress} note>{item.location.address}</Text>
                            </Body>
                            <Right style={{borderBottomWidth:0}}>
                              <FontAwesome name='angle-right' style={{fontSize:22,color:"rgba(102, 102, 102, 0.5)"}} />
                            </Right>
                        </ListItem>
                    } />
          </Content>
        </View>

    )
  }
}

class MapViewTab extends React.Component {

  constructor(props) {
         super(props);
         this.state = {
             users: {},
             modalVisible: false,
         }
         this.markerTapped = this.markerTapped.bind(this);
     }

     navigateToDetails(item) {

          NavigationActions.clientDetails({ clientData : item})

     }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentWillUnmount() {
      timer.clearTimeout(this);
  }


  markerTapped (i) {
    //alert('markerTapped : ' + i);
    if(i > 1) {
    this.refs.scroll.getScrollResponder().scrollTo({x: 0 , y: i * 71 - 30 , animated: true})
    this.showMsg()
  }
  else{
    this.refs.scroll.getScrollResponder().scrollTo({x: 0 , y: i * 71 , animated: true})
  }
}

  measureView(event) {
    console.log('event peroperties: ', event);
    console.log('height : ' + event.nativeEvent.layout.height)
    }

  render () {

    var markers = [];

      this.props.users.map((item, i) => (
        markers.push(<MapView.Marker
                      coordinate={{latitude: Number(item.lat),
                        longitude: Number(item.lng)}}
                      title={item.name}
                      description={item.location.address}
                      image={Images.mapIcon}
                      key={i}

                    />)
    ));

    //onPress={() => this.markerTapped(i)}


    return (
      <Content>
      <View style={{height:250}}>

        <MapView
            style={{flex:1}}
            clusterMarkers={true}
            initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >

        {markers}

        </MapView>

      </View>

      <View>
        <Text style={styles.listViewTitle}>
          Found {this.props.users.length} clients nearby
        </Text>
        <View style={styles.separater}>
            <Hr lineColor={Colors.separetorLineColor}/>
        </View>
        <Content ref="scroll" style={{marginBottom:20}}>
           <List ref={'listView'} dataArray={this.props.users} renderRow={(item) =>
                    <ListItem onLayout={(event) => this.measureView(event)} button avatar onPress={() => this.navigateToDetails(item)} style={{marginTop:(width >= 375) ? 14 : 10,paddingBottom:(width >= 375) ? 14 : 10, borderBottomWidth:1, borderColor:'rgb(234, 234, 234)', marginRight:(width >= 375) ? 20 : 10}}>
                        <Left>
                          <View>
                             <Image source={require('../../Images/dummy/user4.jpeg')} style={styles.listImage}/>
                             <View style={(item.online === true) ? Fonts.style.onlineDotMessages : Fonts.style.offlineDotMessages}></View>
                          </View>
                        </Left>
                        <Body style={{borderBottomWidth:0}}>
                          <Text style={styles.listname}>{item.name}</Text>
                          <Text style={styles.listAddress} note>{item.location.address}</Text>
                        </Body>
                        <Right style={{borderBottomWidth:0}}>
                          <FontAwesome name='angle-right' style={{fontSize:22,color:"rgba(102, 102, 102, 0.5)"}} />
                        </Right>
                    </ListItem>
                } />
      </Content>

    </View>


      {/*
          <DataListView users={this.props.users}/>

        <Button onPress={() => {this.setModalVisible(!this.state.modalVisible)}}
                    style={Fonts.style.filterbuttonMapView}>
              <MaterialCommunityIcons name="filter-outline" size={(width >= 375) ? 28 : 20} style={{color:'white',marginTop:5,}}/>
          </Button>*/}
    <Modal
      animationType={"slide"}
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {alert("Modal has been closed.")}}>
       <Container>
          <View style={styles.headerView}>
            <View style={styles.navbarview}>
              <View style={{flex:1}}>
                <Button transparent iconLeft onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                  <MaterialCommunityIcons name="close" size={28} style={{color:'white'}}/>
                </Button>
              </View>
              <View style={styles.navbarCenterView}>
                  <Text style={[Fonts.style.h1,Fonts.style.textWhite,{textAlign:'center'}]}> FILTER </Text>
              </View>
              <View style={{flex:1}}>
              <Button transparent>
                  <Text></Text>
              </Button>
              </View>

          </View>
        </View>

        <Filter />

    </Container>
  </Modal>

      </Content>
    )
  }
}


class NoSearchResult extends React.Component {

  render () {
    return (
      <Content contentContainerStyle={{alignItems:'center'}}>
      <Image source={Images.SearchEmpty} style={styles.emptyImage} />
      <Text style={[Fonts.style.buttonTextNormalGrey,styles.emptyText]}>
             NO CLIENTS WERE FOUND NEARBY
      </Text>


      </Content>
    )
  }
}

class Filter extends React.Component {

  static defaultProps = {
    value: 3,
  };

  state = {
    value: this.props.value,
  };

 render () {
   return (

         <ScrollView style={{backgroundColor:Colors.background}}>

            <Text style={styles.filtertitles}>
              SEARCH RADIUS
            </Text>
            <Slider
              {...this.props}
              onValueChange={(value) => this.setState({value: value})}
              maximumValue={5}
              minimumValue={1}
              step={10}
              maximumTrackTintColor='white'
              minimumTrackTintColor='white'
              style={{marginTop:10,marginLeft:25,marginRight:25}}
               />

              <View style={styles.milesView}>
                <Text style={styles.mileText} >
                  1 MILE
                </Text>

                <Text style={styles.mileText} >
                  5 MILE
                </Text>
              </View>
              <Text style={styles.filtertitles}>
              GYM NAME
              </Text>
              <View style={[Fonts.style.inputWrapperBordered, {marginRight: 20, marginLeft:20, marginBottom:20, height:45, borderRadius:30}]}>
                <Input  style={Fonts.style.inputBordered} placeholder='Gym Name' placeholderTextColor={Fonts.colors.input}/>
              </View>

              <Text style={styles.filtertitles}>
                POSTCODE
              </Text>
              <View style={[Fonts.style.inputWrapperBordered, {marginRight: 20, marginLeft:20, marginBottom:20, height:45,borderRadius:30}]}>
                <Input  style={Fonts.style.inputBordered} placeholder='Postcode' placeholderTextColor={Fonts.colors.input}/>
              </View>
            <Text style={styles.filtertitles}>
              WORKOUTS
            </Text>

            <View style={styles.buttonsView}>
                <Button rounded small style={{paddingLeft:15, paddingRight:15,marginRight:5,marginBottom:10, height:50, backgroundColor:'white'}}><Text style={{fontSize:15, fontFamily:Fonts.type.regular, color:Colors.subHeadingRegular}}>Yoga</Text></Button>
                <Button rounded small style={{paddingLeft:15, paddingRight:15,marginRight:5,marginBottom:10, height:50, backgroundColor:'white'}}><Text style={{fontSize:15, fontFamily:Fonts.type.regular, color:Colors.subHeadingRegular}}>Cardio</Text></Button>
                <Button rounded small style={{paddingLeft:15, paddingRight:15,marginRight:5,marginBottom:10, height:50, backgroundColor:'transparent',borderWidth:2,borderColor:'white'}}><Text style={{fontSize:15, fontFamily:Fonts.type.regular, color:'#fff'}}>Fartlek</Text></Button>

              </View>


            <View style={styles.horizontalRow}>
             <Hr lineColor='white'/>
            </View>

            <View style={styles.applyBtnView}>
                <Button rounded block style={{marginTop:20,marginBottom:10,marginLeft:20,marginRight:20,backgroundColor:'white', height:57}}>
                    <Text style={styles.applyBtnText}> APPLY</Text>
                </Button>
            </View>


         </ScrollView>



   )
 }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(SearchScreen)
