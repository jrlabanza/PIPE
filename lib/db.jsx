import mysql from 'serverless-mysql'

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT),
  },
})

export const masterlist = mysql({
  config: {
    host: process.env.MYSQL_MASTERLIST_HOST,
    database: process.env.MYSQL_MASTERLIST_DATABASE,
    user: process.env.MYSQL_MASTERLIST_USERNAME,
    password: process.env.MYSQL_MASTERLIST_PASSWORD,
    port: parseInt(process.env.MYSQL_MASTERLIST_PORT),
  },
})

export async function query(
  q,
  values
) {
  try {
    const results = await db.query(q, values)
    await db.end()
    return results
  } catch (e) {
    throw Error(e.message)
  }
}

export async function masterlistQuery(
  q,
  values
) {
  try {
    const results = await masterlist.query(q, values)
    await masterlist.end()
    return results
  } catch (e) {
    throw Error(e.message)
  }
}
