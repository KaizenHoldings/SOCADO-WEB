import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const run = async () => {
  const email = process.argv[2]
  if (!email) {
    console.error('Error: Debes proporcionar el correo del usuario.')
    console.error('Uso: npx tsx unlock-user.ts <email>')
    process.exit(1)
  }

  console.log(`Inicializando Payload para desbloquear a: ${email}...`)
  
  try {
    const payload = await getPayload({ config: configPromise })

    // Busca el usuario primero
    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.length === 0) {
      console.error(`Error: No se encontró ningún usuario con el correo ${email}`)
      process.exit(1)
    }

    const user = users[0]

    // Payload tiene la función unlock para colecciones con auth
    const result = await payload.unlock({
      collection: 'users',
      data: {
        email: email,
      },
    })

    if (result) {
      console.log(`✅ Usuario ${email} desbloqueado exitosamente.`)
    } else {
      console.log(`⚠️ El usuario ${email} fue encontrado pero no se pudo desbloquear (puede que no estuviera bloqueado).`)
    }
  } catch (err) {
    console.error('Error al intentar desbloquear al usuario:', err)
  }
  
  process.exit(0)
}

run()
