import { storage } from "./firebase/setup"


export const getDownloadUrl = (urlPath) => {
    var ref = storage.ref(urlPath)
    return ref.getDownloadURL()
}