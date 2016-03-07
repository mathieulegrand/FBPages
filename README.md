# Facebook Pages Manager

## Assignment

Create an application for the management of a Facebook Page. This can be a Web app or a mobile app, you can choose.

The app must be able to create regular posts to a Facebook Page as well as Unpublished Page Posts. The app will be able to list posts (both published and unpublished) from a page, and show the number of people who have viewed each post

## Initial choices

* The application will be an iOS mobile app for the iPhone.
* It will be created using the [React Native](https://facebook.github.io/react-native) framework.
* The application will make use of [Facebook React Native SDK](https://github.com/facebook/react-native-fbsdk).

## Dependencies

The current build depends several libraries listed in `package.json`.

At the core of the application:
- [`react-native`](https://facebook.github.io/react-native)
- [`redux`](http://redux.js.org) and [`react-redux`](https://github.com/reactjs/react-redux) to provide a state framework to the app.
- [`redux-thunk`](https://github.com/gaearon/redux-thunk) to provide additional functionalities to the `redux` store.
- [`redux-logger`](https://github.com/fcomb/redux-logger) a convenient logger to track mutations to the store.
- [`react-native-fbsdk*`](https://github.com/facebook/react-native-fbsdk) to access the Graph API of Facebook.

A few convenience React libraries:
- [`react-native-drawer`](https://github.com/root-two/react-native-drawer) a wrapper around a View with animated slidding functionalities to use as a side drawer UI element in the app.
- [`react-native-safari-view`](https://github.com/naoufal/react-native-safari-view) to open a native Safari View Controller when opening URLs inside the app.
- [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) for easy access to some images for the UI of the app.

And some classic Javascript libraries:
- [`lodash`](https://lodash.com) for the convenience functions such as assign, union and concat.
- [`moment`](http://momentjs.com) to display nicely formatted dates.

The dependencies are installed by running `npm install`.

For the record, if starting from scratch on a new empty React Native project:
> Three libraries did require additional configuration within Xcode, as they depend on native Objective-C libraries. Please do refer to the pages on [`react-native-safari-view`](https://github.com/naoufal/react-native-safari-view), [`react-native-fbsdk*`](https://github.com/facebook/react-native-fbsdk) and [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) for details on the additional steps to be taken.
> I selected to install [`react-native-safari-view`](https://github.com/naoufal/react-native-safari-view) by copying the two files `SafariViewManager.*` into my project.
> For the other libraries, I used [CocoaPods](https://cocoapods.org); my `Podfile` is available in the directory `<root>/ios`.

This additional configuration should not be required to build the project.

## Structure

As per the default React Native template, the main entry point is the file `index.ios.js`. In that file, we call into `<root>/app/configureStore` to setup the `redux` store with the middleware mentioned in the dependencies list; and we the return the root element of the application `<Root/>` from `<root>/app/root.js`.

All the other application files are contained within the `<root>/app` subfolder.

We find the `redux` stores related files: `reducers.js` and `actions.js`; as well as the `root.js` main application file. We have a folder for the simple components `app/components`, and a folder for the main scenes (screens) of the app `app/scenes`.

In addition, we have `app/facebookAPI.js` from which are issued all the Graph API calls to Facebook. All of these functions wrap `FBSDKGraphRequest` with special parameters and return ES6 `Promises` for convenience.

Last, we have two versions of the `redux` store and middleware configuration file: `app/configureStore,js` and `app/configureStore.nolog.js`. The second file is the template for a build that does not log state mutations; I copy that file over `app/configureStore.js` to make the bundle for on-device build of the app.

The components and scenes files are documented in the README.md file in their respective subfolder.

## Running

### Debug mode

To run **in debug mode**, execute

      react-native run-ios

from the root folder of the project. This will require Xcode to be installed, along with an iPhone emulator and Google Chrome for the React Native Debugger.

The packager may or may not start in a new Terminal window; if it does not start, please run

      react-native start

in another window, and keep it running (you'll need to restart it only if you add new dependencies to the project).

### On device

To package the app **for the iPhone**, we must first create a bundle of the Javascript files. To do so, execute

      react-native bundle --entry-file index.ios.js --bundle-output ios/main.jsbundle

from the root folder of the project.

Open `<root>/ios/FBPages.xcworkspace` inside Xcode and edit the file `AppDelegate.m`. Within the method `application:didFinishLaunchingWithOptions`, you'll find two options for the value of `jsCodeLocation`. The URL is used with `react-native start` packager for the debug mode described above. The second option loads the pre-generated `main.jsbundle`, and is used for on-device builds.
Comment option 1, and uncomment option 2. Then build the app from Xcode, and FBPages should be running on a connected phone.


