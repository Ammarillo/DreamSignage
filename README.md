# DreamSignage
DreamSignage is a dynamic Digital Signage software solution powered by Node.js, designed to serve as an adaptable and efficient file viewer. Capable of supporting a wide array of file formats, DreamSignage can be easily deployed on any web server or cloud platform. Its compatibility with modern web browsers ensures a seamless user experience across a diverse range of devices.

From PDF, PNG, JPG/JPEG, GIF, SVG, WebP, MP4, to WebM, DreamSignage offers an intuitive way to display your files. It effortlessly scales content to fit your screen while preserving original aspect ratios, ensuring an engaging fullscreen viewing experience.


## Features
- **Versatile File Display:** DreamSignage proficiently handles various file formats, offering effortless interaction with documents, images, and videos.
- **Fullscreen View:** Experience your content in distraction-free fullscreen mode, offering an immersive viewing experience.
- **Responsive Design:** DreamSignage's design is responsive, dynamically adjusting content according to the screen size and resolution to ensure optimal viewing across all devices.
- **Multi-Site PDF Viewing:** DreamSignage provides a comfortable reading experience by displaying PDF files one page at a time.
- **Configurable Timer Display:** Adjust the display duration of files to fit your needs with a configurable timer.
- **Offline & Local Network Capability:** DreamSignage can operate fully offline within a local network.
- **Automatic ZIP Content Updates:** DreamSignage offers a unique feature to automatically fetch and update content from a remote ZIP file. Centralize your content updates with ease, as DreamSignage periodically checks, downloads, and seamlessly integrates new content from your specified ZIP source, ensuring your displays always stay current.
- **Websockets Integration:** By utilizing websockets, DreamSignage promptly reacts to file events, updating content automatically with each file change.
- **Cross-Platform Server Deployment:** The DreamSignage server can be deployed on both Linux and Windows platforms, ensuring comprehensive compatibility.
- **HTTPS Support:** DreamSignage offers the capability to run securely over HTTPS. This optional feature enables hosting of content with enhanced security, ensuring data is safely transmitted over the network. Elevate your experience with DreamSignage by utilizing the power of HTTPS.


## How It Works
DreamSignage operates by tracking a designated 'content' folder. Any file within this folder (provided it's a supported file type) will be automatically displayed on the software interface. Through websockets, DreamSignage stays responsive to file events, guaranteeing that your content remains current with every change.

## Compatibility
DreamSignage is compatible with all modern web browsers, including Chrome, Firefox, Safari, Edge, and more. The server can be deployed on both Linux and Windows platforms, reinforcing its extensive adaptability.

## Getting Started
To install DreamSignage follow one of the following instructions
<details>

<summary>Linux</summary>

  ### Step 1: Install Node.js
  Before you can run the DreamSignage application, ensure Node.js is installed on your system. Node.js is a runtime environment that allows you to run JavaScript on the server side.
  Check if Node.js is installed by running:
  ```
  node -v
  ```
  If Node.js is not installed, download and install it. On a Linux machine, use the apt package manager:
  ```
  sudo apt update
  sudo apt install nodejs
  ```
  Make sure to have at least NodeJS Version `v18.15.0`. This is the version im working on this project.
  ```
  node -v
  ```
  ### Step 2: Create a Directory for DreamSignage
  Create a directory where you will install the DreamSignage application:
  ```
  mkdir DreamSignage
  ```
  ### Step 3: Clone DreamSignage repository from GitHub
  After creating the directory, navigate into it and clone the DreamSignage repository from GitHub. This will create a copy of the application's codebase on your system.
  ```
  cd DreamSignage
  git clone https://github.com/Ammarillo/DreamSignage.git
  ```
  ### Step 4: Install Dependencies
  DreamSignage application relies on other libraries or modules. These dependencies need to be installed before you can run the application. This can be done using npm, the Node.js package manager.
  ```
  npm install
  ```
  ### Step 5: Install Forever
  Forever is a simple CLI tool that ensures a given script runs continuously. Install forever globally using npm:
  ```
  sudo npm install -g forever
  ```
  ### Step 6: Start the Application with Forever
  Once forever is installed, you can use it to start your application:
  ```
  forever start DS.js
  ```
  ### Step 7: Setup Automatic Restart on System Reboot
  We will use the cron service to automatically restart the application whenever the system reboots. Open your crontab file for editing:
  ```
  crontab -e
  ```
  Add the following line to the end of the crontab file:
  ```
  @reboot forever start --sourceDir /path/to/DreamSignage/ DS.js
  ```
  Replace /path/to/DreamSignage with the actual path to your DreamSignage application directory. Save the file and close the text editor. The cron service will   automatically load the new job and will start running the next time you reboot the system.

  Congratulations! You have now installed and set up your DreamSignage application to run continuously and restart at every system boot.
</details>

<details>

<summary>Windows</summary>
  
  ### Step 1: Install Node.js
  First, we'll need to install Node.js:
  1. Download the latest stable version of Node.js from 
  https://nodejs.org/en/download
  2. Run the installer and follow the instructions to install Node.js and npm, Node's package manager.
  ### Step 2: Download DreamSignage repository from GitHub
  To get your application files onto your computer, you can download the zip directly from GitHub and extract it:
  1. Go to the repository at https://github.com/Ammarillo/DreamSignage.
  2. Click the green `Code` button, then click `Download ZIP`.
  3. Once the download is finished, extract the zip file into your desired directory.
  ### Step 3: Install Dependencies
  1. Open a PowerShell window.
  2. Navigate to the DreamSignage application directory:
  ```
  cd x:\\path\to\DreamSignage
  ```
  3. Install the dependencies with npm:
  ```
  npm install
  ```
  ### Step 4: Install node-windows
  `node-windows` is a module that allows you to interact with the Windows services.
  1. Install `node-windows` globally using npm:
  ```
  npm install -g node-windows
  ```
  ### Step 5: Create a Script to Install the Service
  We need to create a script that will install a Windows service to run your application. In the root of your project directory, create a new file called `installService.js` and add the following content:
  ```
  var Service = require('node-windows').Service;

  // Create a new service object
  var svc = new Service({
    name:'DreamSignage',
    description: 'Node.js server for DreamSignage',
    script: require('path').join(__dirname,'DS.js'),
  });

  // Listen for the "install" event, which indicates the service is available
  svc.on('install',function(){
    svc.start();
  });

  // Install the script as a service
  svc.install();
  ```
  ### Step 6: Install the Service
  With your script created, you can now install the service:
  ```
  node installService.js
  ```
  Now, your DreamSignage application will start automatically when your computer boots, and it will keep running in the background.
</details>

## How to use DreamSignage Application
In this guide, we will walk through the steps to use this application.
### Step 1: Install the Application
First, you need to install the DreamSignage application. Please follow the installation guide provided above according to your operating system (Windows or Linux).
### Step 2: Adding Content to be Displayed
Once installed, find the `public` folder within the DreamSignage directory. Inside this `public` folder, there should be a `content` folder.
<br>You can add any files you want to display on your web page into this `content` folder. The application will automatically pick up these files and display them on the web page.
### Step 3: Access the Webpage
By default, the webpage can be accessed locally at `http://localhost:3000/`. If you've added content to the `content` folder, you should see it displayed on this page.
### Step 4: Modify Application Settings
If you want to change certain application settings, like the content interval, HTTP port or other settings, you can do so by editing the `default.json` file located inside the `config` folder.
<br>For instance, if you want to change the HTTP port to 8000, you would open the `default.json` file and look for the line with the `"httpPort"` setting and change it to `"httpPort": 8000`.
<br>Please remember to save the `default.json` file after making any changes.

```
{
    "config": { 
        "scanIntervall": 5,
        "contentIntervall": 20,
        "backgroundColor": "#141414",
        "httpPort": 3000,
        "useSSL": false,
        "sslkey": "/etc/example/privatekey.pem",
        "sslCert": "/etc/example/fullchain.pem",
        "sslPort": 3001,
        "useZipDownload": false,
        "zipURL": "https://example.de/example-content.zip",
        "zipDownloadIntervall": 60
    }
}
```
### Step 5: Restart the Application
In order for the changes you made in `default.json` to take effect, you need to restart the DreamSignage application. Depending on how you've set up the application to run (as a service, with `forever`, etc.), the steps to do this may vary. Generally, you would stop the running process and then start it again.
<br>Now, you should be able to use the DreamSignage application to display your content on a webpage.
### Step 6: Updating your Content
Whenever you want to change the content being displayed, simply replace the files in the `content` folder with the new content you want to show. The application will automatically pick up these new files.
<br>That's it! You now know how to use the DreamSignage application.

### Optional URL ZIP Download Feature
DreamSignage provides an optional feature that allows users to automatically download content from a remote server via a ZIP file. This feature is particularly useful for users who want to centralize and easily update the content displayed across multiple DreamSignage installations. By simply updating the ZIP file on a remote server, all DreamSignage installations configured to fetch from that server will automatically update their content.
## How the ZIP Download Feature Works
**1. Configuration:** In the `default.json` file located inside the `config` folder, there are a few settings related to the ZIP download feature. The `"useZipDownload"` setting determines whether the feature is active. If set to `true`, DreamSignage will attempt to download content from the URL specified in the `"zipURL"` setting.<br>
**2. Automatic Downloads:** When the ZIP download feature is active, DreamSignage will periodically check the remote server for updates based on the `"zipDownloadIntervall"` setting (specified in minutes). If a new ZIP file is detected, it will be downloaded and extracted automatically, updating the content displayed by DreamSignage.<br>
**3. Content Overwrite:** Each time a new ZIP file is downloaded, the existing content in the `public/content` folder will be overwritten with the new content from the ZIP file. It's important to note that any manual changes or additions to the `public/content` folder will be lost when a new ZIP is downloaded. You can disable this by changing `keepUnchangedFiles` to `true`.<br>

## Configuring the ZIP Download Feature
To activate and configure the ZIP download feature:<br>
**1.** Open the `default.json` file in the `config` folder.<br>
**2.** Set the `"useZipDownload"` setting to `true`.<br>
**3.** Provide the URL of the ZIP file in the `"zipURL"` setting. For example: `"zipURL": "https://example.com/path/to/content.zip"`.<br>
**4.** (Optional) Adjust the `"zipDownloadIntervall"` setting to determine how often DreamSignage should check for updates. The default is set to 60 seconds.<br>
**5.** (Optional) Change the `"keepFiles"` setting to `true` if you want to keep files which are not inside the ZIP file.<br>
**6.** Save the `default.json` file and restart the DreamSignage application for the changes to take effect.<br>
