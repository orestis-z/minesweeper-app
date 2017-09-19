import { Alert } from 'react-native';

export default function errorHandle(obj, title) {
  console.log(obj);
  Alert.alert(title || 'Error',
    obj.message ||
    obj.description ||
    obj.errorMessage ||
    JSON.stringify(obj)
  ); 
}
