import '../styles/globals.scss'
import 'semantic-ui-css/semantic.min.css'
import {AuthProvider} from './../components/contexts/authContext'
import { InferGetStaticPropsType } from 'next'
function MyApp({ Component, pageProps }) {
  
  return <AuthProvider>
          <Component {...pageProps} />
      </AuthProvider>
}



export default MyApp
