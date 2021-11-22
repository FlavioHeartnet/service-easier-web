import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import {Form, Button, Input} from 'semantic-ui-react'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setLoading] = useState(false)
  function login(){
    setLoading(true)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Organização de serviços prestados</title>
        <meta name="description" content="Aqui você pode organizar seus serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Service Easier <br/><a href="">Gestão de Serviços!</a>
        </h1>

        <p className={styles.description}>
          Faça seu login aqui!
        </p>  
      <Form onSubmit={login}> 
      <Form.Field
        id='form-input-control-last-name'
        control={Input}
        label='E-mail'
        placeholder='Digite seu E-mail'
        type='email'
        required
      />
      <Form.Field
        id='form-input-control-last-name'
        control={Input}
        label='Senha'
        placeholder='Digite sua Senha'
        type='password'
        required
      />
      <Button loading={isLoading} primary>Entrar</Button>
      <Button type={'button'}>Não tem acesso? cadastre-se</Button>
      </Form>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
