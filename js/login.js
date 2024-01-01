const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;
const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_HRNxCH2uOKsHfaXkolyzmnrykq_CWMw",
    authDomain: "tom-website-1ba23.firebaseapp.com",
    projectId: "tom-website-1ba23",
    storageBucket: "tom-website-1ba23.appspot.com",
    messagingSenderId: "555153773493",
    appId: "1:555153773493:web:65de83d292391aafdd3ffc"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the authentication service
const auth = firebase.auth();

// Event listener for image upload
bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
});

// Function to upload image
const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            } else {
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        });
    } else {
        alert("Upload Image only");
    }
};

// Function to add image to the article
const addImage = (imagepath, alt) => {
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
};

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Event listener for publish button
publishBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user && articleFeild.value.length && blogTitleField.value.length) {
        // Generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++){
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // Setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // For published at info

        // Access Firestore with db variable
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleFeild.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            author: user.uid  // Add the user's ID as the author
        })
        .then(() => {
            location.href = `/${docName}`; 
        })
        .catch((err) => {
            console.error(err);
        });
    } else {
        // If user is not logged in, you can redirect to the login page or show an error message.
        alert("Please log in before publishing.");
    }
});

// Additional Firebase Authentication listeners (login, logout, etc.) can be added as needed.
