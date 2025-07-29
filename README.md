# SecurePass
Checks password entered in password input fields on chrome browser against exposed HIBP passwords.

### Installation
Clone git repo. Open Google Chrome extension settings and click load unpack.

Select extension folder.

### It looks like this
(There is light and dark mode as well)

https://github.com/user-attachments/assets/cf5859a1-346f-471e-942c-d689a5624687

### Structure
- Manifest.json - declares the permissions / actions of the extension to the browser and location of relevant files
- src/public - icons
- src/background - extension service worker to interact with browser events
- src/content - extension content script to interact with DOM elements on web page
- src/ui - makes it look pretty. 
