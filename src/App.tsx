import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react'
import './App.css'
import { FaUser } from "react-icons/fa";



function App() {
  const { data, isPending } = useQuery({
    queryKey: ['users'], queryFn: () => {
      return axios
        .get('https://6781424785151f714b0a074d.mockapi.io/users')
        .then((res) => res.data)
    }
  })
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newUser: { name: string; email: string; age: number }) => axios.post('https://6781424785151f714b0a074d.mockapi.io/users', newUser).then(res => res),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  // const mutationUpdate = useMutation({
  //   mutationFn: (id) => axios.put(`https://6781424785151f714b0a074d.mockapi.io/users/${id}`),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //   },
  // });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`https://6781424785151f714b0a074d.mockapi.io/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const [newUser, setNewUser] = useState({ name: '', email: '', age: 0 });
  const handleAdd = () => {
    mutation.mutate(newUser);
    setNewUser({ name: '', email: '', age: 0 });
  };

  return (
    <>
      <div>
        {isPending && <p>Loading...</p>}
        <div className='container m-auto flex justify-center gap-5 my-5'>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className='border py-1 px-2 rounded-lg'
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className='border py-1 px-2 rounded-lg'
          />
          <input
            type="number"
            placeholder="Age"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: Number(e.target.value) })}
            className='border py-1 px-2 rounded-lg'
          />
          <button onClick={handleAdd} className='bg-green-700 text-white py-1 px-5 rounded-lg'>Add User</button>
        </div>
        {data && (
          <div className='container m-auto grid grid-cols-4 gap-5'>
            {data.map((item: any) => (
              <div key={item.id} className='shadow-md py-4 px-3 flex flex-col gap-2'>
                <FaUser className='m-auto text-3xl'/>
                <h3>Name: {item.name}</h3>
                <p>Email: {item.email}</p>
                <p>Age: {item.age}</p>
                <button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(item.id)} className='bg-rose-700 text-white w-full py-1 rounded-md'>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App
