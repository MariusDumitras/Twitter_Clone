const Pool = require('pg').Pool
const bcrypt = require ("bcrypt");
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email, password } = request.body
  const passwordhash = bcrypt.hashSync(password, 10);
  console.log(name)
  console.log(email)
  console.log(passwordhash)
  console.log(request.body)
  pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning id ', [name, email, passwordhash], (error, results) => {
    if (error) {
      if (error.code === "23505") {
        response.status(201).json({message: error.detail})
      } else { 
        throw error
      }
      
    }
  response.status(201).json({message:`User added with ID: ${results.rows[0].id}`})
  //console.log(results)
  })

}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email, password } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4',
    [name, email, password, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}



module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
