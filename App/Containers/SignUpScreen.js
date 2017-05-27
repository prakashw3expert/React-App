import React, { PropTypes } from 'react'
import {View,Alert, ScrollView, Text, TextInput,NativeModules, TouchableOpacity, Image, Keyboard, LayoutAnimation, StatusBar,Platform, Modal } from 'react-native'
import Hr from 'react-native-hr'
import { Container, Content,Input,Form,Item, Left,Icon,Body, Right, ListItem,Thumbnail,List,Button,Card, CardItem,Label } from 'native-base';
import * as EmailValidator from 'email-validator';
import { connect } from 'react-redux'
import Styles from './Styles/LoginScreenStyles'
import {Images, Metrics,Fonts, Colors} from '../Themes'
import LoginActions from '../Redux/UserRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';

import Terms from './Terms'
import PrivacyPolicy from './PrivacyPolicy'

const Digits = require('react-native-fabric-digits');
const { DigitsLoginButton, DigitsLogoutButton } = Digits;
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager, LoginButton, GraphRequest, GraphRequestManager,AccessToken
} = FBSDK;

class SignUpScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fetching: PropTypes.bool,
    attemptSignup: PropTypes.func,
    fbLogin: PropTypes.func
  }

  isAttempting = false
  keyboardDidShowListener = {}
  keyboardDidHideListener = {}

  constructor (props) {
    super(props)
    this.state = {
      fbname : '',
      facebook_id : '',
      email: '',
      password: '',
      role : 'client',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
      logged: false,
      error: false,
      response: {},
      mobile : '',
      termsVisible : false,
      privacyVisible : false,
      digitsOptions : {
        title: "PT SPOTTER",
        phoneNumber: "+61",
        appearance: {
          backgroundColor: {
            hex: "#ffffff",
            alpha: 1.0
          },
          accentColor: {
            hex: "#ac0efa",
            alpha: 0.7
          },
          headerFont: {
            name: "Montserrat-Regular",
            size: 16
          },
          labelFont: {
            name: "Montserrat-Bold",
            size: 18.6
          },
          bodyFont: {
            name: "Montserrat-Regular",
            size: 16
          },

        }
      }
    }
    this.completion = this.completion.bind(this);
    this.getSessionDetails = this.getSessionDetails.bind(this);
    this.logout = this.logout.bind(this);
    this.closePrivacy = this.closePrivacy.bind(this);
    this.closeTerms = this.closeTerms.bind(this);
    this.isAttempting = false
  }


  closePrivacy(){
      this.setState({privacyVisible : false})
  }

  closeTerms() {
    this.setState({termsVisible : false})
  }

  completion(error, response) {
    alert('Complition called');
   if (error && error.code !== 1) {
     this.setState({ logged: false, error: true, response: {} });
   } else if (response) {
     if(this.props.newUser){
       const logged = JSON.stringify(response) === '{}' ? false : true;
       this.setState({ logged: false, error: false, response: response }, this.getSessionDetails);
       console.log('digit response on new user : ',response);
       this.props.newUser = false;
     }
     else{
       const logged = JSON.stringify(response) === '{}' ? false : true;
       this.setState({ logged: logged, error: false, response: response }, this.getSessionDetails);
       console.log('digit response on  : ',response);
     }

   }
 }
 logout () {
    NativeModules.DigitsManager.logout();
 }

 getSessionDetails() {

   NativeModules.DigitsManager.sessionDetails((error, sessionDetails) => {
     if (error) {
       console.error(error);
     } else {
       console.log('mobile : ',sessionDetails.phoneNumber);
       this.setState({mobile : sessionDetails.phoneNumber})
       if(this.props.newUser){
        //  alert('Signup called fb')
           var signupData = {
             "facebook_id" : this.state.facebook_id,
             "device" : (Platform.OS === 'ios') ? "iphone" : "android",
             "device_Id" : DeviceInfo.getUniqueID(),
             "role" : this.state.role,
             "phone" : sessionDetails.phoneNumber
           }
           this.props.attemptSignup(signupData);

         //NavigationActions.editProfile({userData : profileData, fromFacebook : true})
       }
     }
   });
 }


  componentWillReceiveProps (newProps) {
    console.log('New props+++++++++++++++++++++++++++++++++++++++++')
    if(newProps.newUser){

      NativeModules.DigitsManager.launchAuthentication(this.state.digitsOptions).then((responseData) => {
        console.log("[Digits] Login Successful", responseData);
        this.completion(null, responseData);
      }).catch((error) => {
        if(error && error.code != 1){
          console.error("[Digits] Login Error", error);
        }
        this.setState({ logged: false, error: true, response: {} });
        //this.completion(error, null);
      });
    }

  }

  componentWillMount () {
    
    this.setState({ role : this.props.role});
    if(this.state.mobile === '') {

      this.setState({logged : false, response : {}},this.logout)

    }

    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,

    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }

  handleFacebookLogin = () => {
  //  alert('Facebook btn tapped')

      LoginManager.logInWithReadPermissions(['public_profile','email']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {
          // alert('Login success with permissions: '
          //   +result.grantedPermissions.toString());
          console.log(result)
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              let accessToken = data.accessToken
            //  alert(accessToken.toString())   //success

              const responseInfoCallback = (error, result) => {
                if (error) {
                  console.log(error)
                  alert('Error fetching data: ' + error.toString());
                } else {
                  console.log(result)
                  var facebookId = result.id;
                  var name = result.name;
                  var email = result.email;
                  const device_Id = DeviceInfo.getUniqueID();
                  const device = (Platform.OS === 'ios') ? "iphone" : "android";
                  this.setState({ fbname : name, facebook_id : facebookId})
                  var LoginData = {
                    "name" : name,
                    "facebook_id" : facebookId,
                    "device" : device,
                    "device_id" : device_Id
                  }
                  this.props.fbLogin(LoginData);

                }
              }

              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: accessToken,
                  parameters: {
                    fields: {
                      string: 'email,name,first_name,middle_name,last_name'
                    }
                  }
                },
                responseInfoCallback
              );

              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start()

            }
          )
        }
      }.bind(this),
      function(error) {
        alert('Login fail with error: ' + error);
      }
    );
  }

  handlePressSignup = () => {

    var signupData = {
      "email" : this.state.email,
      "password" : this.state.password,
      "device" : (Platform.OS === 'ios') ? "iphone" : "android",
      "device_Id" : DeviceInfo.getUniqueID(),
      "role" : this.state.role,
      "phone" : this.state.mobile
    }

    this.props.attemptSignup(signupData)

  }



  render () {

    var isSubmit = (
      this.state.email
      && this.state.password
      && EmailValidator.validate(this.state.email) ) ? true : false;


    const content = this.state.logged ?
        <View style={Fonts.style.mt15}>
          <Button light full rounded style={Fonts.style.default} disabled={!isSubmit} onPress={this.handlePressSignup}>
              <Text style={[Fonts.style.buttonText, Fonts.style.textBold]}>CONTINUE</Text>
          </Button>
        </View>
        :

        <DigitsLoginButton
          ref="DigitsLoginButton"
          options={this.state.digitsOptions}
          disabled={!isSubmit}
          completion={this.completion}
          text="SIGNUP VIA EMAIL"
          buttonStyle={Fonts.style.signupButtonWithDigits}
          textStyle={[Fonts.style.buttonText, Fonts.style.textBold]}/>

    const { email, password } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly



    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
      <StatusBar barStyle='light-content' backgroundColor={Colors.background}/>
      <View style={[Styles.topHeading]}>
        <View style={Styles.navigationbar} >
        <TouchableOpacity onPress={NavigationActions.pop} style={{height:40, flex:.5}}>
            <FontAwesome name='angle-left' style={{fontSize:32, color : Colors.white}}/>
        </TouchableOpacity>
        <Text style={[Fonts.style.h1, Fonts.style.textWhite, Fonts.style.mb20, { flex:2}]}>PT SPOTTER</Text>
        </View>
        <Text style={[Fonts.style.h6, Fonts.style.textWhite, Fonts.style.mb60]}>THE NEW WAY TO FIND YOUR PERFECT PERSONAL TRAINER</Text>
      </View>

      <Item rounded style={Fonts.style.inputWrapper}>
            <Icon name='mail' style={{marginTop:3,marginLeft:15,marginRight:10,color:'rgb(172,14,250)',backgroundColor:'transparent'}}/>
            <Input
              style={Fonts.style.input}
              placeholder='EMAIL'
              ref={'email'}
              placeholderTextColor={Fonts.colors.input}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={(email) => this.setState({email})}
              autoCorrect={false}
              onSubmitEditing={ () => { if (!EmailValidator.validate(this.state.email)) {
                                  alert('Invalid Email');
                                  this.refs.email._root.focus()
                                } else {
                                  this.refs.password._root.focus()
                                }}}
              />
        </Item>

        <Item rounded style={Fonts.style.inputWrapper}>
              <Icon name='lock'style={{marginTop:3,marginLeft:15,marginRight:10,color:'rgb(172,14,250)',backgroundColor:'transparent'}}/>
              <Input
                onChangeText={(password) => this.setState({password})}
                style={Fonts.style.input}
                placeholder='PASSWORD'
                placeholderTextColor={Fonts.colors.input}
                secureTextEntry
                ref={'password'}/>
        </Item>
      {  /*disabled={!isSubmit}*/}
      {/*<View style={Fonts.style.mt15}>
        <Button light full rounded style={Fonts.style.default}  onPress={this.handlePressSignup}>
            <Text style={[Fonts.style.buttonText, Fonts.style.textBold]}>SIGNUP VIA EMAIL</Text>
        </Button>
      </View>*/}

      { content }

      <View style={Styles.separater}>
          <Hr lineColor='white' text='OR' textColor='white' textSize="18" style={{fontWeight:'bold',fontSize:18.6,letterSpacing: 3.8, fontFamily:Fonts.type.bold}}/>
      </View>


      <View>
        <Button light full rounded style={Fonts.style.facebook} onPress={this.handleFacebookLogin.bind(this)}>
            <Text style={[Fonts.style.buttonText, Fonts.style.textBold]}>SIGNUP VIA FACEBOOK</Text>
        </Button>
      </View>

        <View style={Styles.footerSingup}>
            <Text style={[Styles.footeText,Styles.footerTextSingup]}>
              By clicking Sign Up you agree to our <Text style={Styles.footeSingupLink} onPress={() => this.setState({termsVisible : true})}> Terms of Use </Text> and <Text style={Styles.footeSingupLink} onPress={() => this.setState({privacyVisible : true})}> Privacy Policy </Text>
            </Text>
        </View>

        <DigitsLogoutButton
            ref="DigitsLogoutButton"
            completion={this.completion}
            text="Logout"
            buttonStyle={[Fonts.style.signupButtonWithDigits,{height:0}]}
            textStyle={[Fonts.style.buttonText, Fonts.style.textBold]}/>


            {/* terms of Service modal here*/}

            <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.state.termsVisible}
              onRequestClose={() => this.setState({termsVisible : false})}>

              <Terms callback={this.closeTerms}/>

            </Modal>

          {/* Privacy Policy Modal here*/}

          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.privacyVisible}
            onRequestClose={() => this.setState({termsVisible : false})}>

            <PrivacyPolicy callback={this.closePrivacy} />

          </Modal>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    //fetching: state.user.fetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptSignup: (data) => dispatch(LoginActions.signupRequest(data)),
    fbLogin: (data) => dispatch(LoginActions.facebookLogin(data))
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen)
