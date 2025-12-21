# Cloudinary Setup Instructions

This guide explains how to set up **Cloudinary** for image and video management in a web application (commonly used with React, Node.js, or other frontend/backend stacks).

---

## 1. Create a Cloudinary Account

1. Go to the Cloudinary website and [sign up](https://cloudinary.com/users/register_free).

2. After successful registration, log in to the **Cloudinary Dashboard**.

3. Choose the appropriate plan (Free plan is sufficient for development and testing).

4. In the dashboard you'll see your default **Product Environment** details and note down the **cloud name** from there.

5. Click on Go to API Keys of Product Environment and it'll take you to settings.

6. In the list of settings available on left sidebar, click on **Upload** setting.

7. In the Upload Preset tab, you'll find a default preset.

8. Edit these preset settings from three dot menu and change the **Signing Mode** of this preset to Unsigned and save.

9. Note down the **Upload preset Name**.

10. Add **Cloud Name** and **Upload Preset Name** in [image-uploader](https://image-uploader-black.vercel.app/) to upload your images to Cloudinary.
