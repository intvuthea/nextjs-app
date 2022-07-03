import Head from 'next/head'
import { useEffect, useState } from 'react';
import Axios from 'services/axios';
import styles from '../styles/Home.module.css'

export default function Home() {
    const [selectTodo, setSelectTodo] = useState({id: null, todo: ''})
    const [errorMsg, setErrorMsg] = useState(null)

    const [filterTodo , setFilterTodo] = useState('')
    const [todoList, setTodoList] = useState([])

    const [isFetchTodoList, setIsFetchTodoList] = useState(false)

    async function fetchTodoList(setLoading = false) {
        setIsFetchTodoList(setLoading)
        try {
            let response = await Axios.get('todo', {params: {todo: filterTodo}})        
            setTodoList(response.data.data)
        } finally {
            setIsFetchTodoList(false)
        }
    }

    function onSearchValueChange(evt) {
        let {value} = evt.target
        if (selectTodo.id) {
            setSelectTodo((prev) => ({
                id: prev.id,
                todo: value
            }))
        } else {
            setFilterTodo(value)
        }
    }

    async function onDeleteClick(item) {
        await Axios.delete(`todo/${item.id}`)    
        if (item.id === selectTodo.id) {
            setSelectTodo({
                id: null,
                todo: ''
            })
        } 
        fetchTodoList() 
    }

    async function toggleComplete(item) {
        await Axios.put(`todo/${item.id}/mark-complete`, {is_complete: !item.isCompleted })
        fetchTodoList() 
    }

    async function onEditClick(item) {
        if (item.id === selectTodo.id) {
            return setSelectTodo({
                id: null,
                todo: ''
            })
        }

        setSelectTodo({
            id: item.id,
            todo: item.todo
        })
    }

    async function submitSearch(evt) {
        evt.preventDefault();
        try {
            if (selectTodo.id) {
                await Axios.put(`todo/${selectTodo.id}`, {todo: selectTodo.todo})
                setSelectTodo({id: null, todo: ''})
            } else {

                await Axios.post('todo', {
                    todo: filterTodo,
                    isCompleted: false,
                    createdAt: (new Date()).toISOString()
                })
            }
            
            if (filterTodo) setFilterTodo('')
            else fetchTodoList()

            setErrorMsg(null)
        } catch (error) {
            if (error.response && error.response.status == 422) {
                setErrorMsg('The data already exist')
            }
        }
    }

    useEffect(() => {
        fetchTodoList(true)
    }, [filterTodo])

    return (
        <div className={styles.container}>
            <Head>
                <title>Todo App</title>
                <meta name="description" content="Todo app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to Todo App
                </h1>
                <div className={styles.filter}>  
                    <form action="" onSubmit={submitSearch}>              
                        <div className={styles.input_group}>
                            <input
                                required
                                type="text" 
                                value={selectTodo.id ? selectTodo.todo : filterTodo} 
                                className={styles.input_text} 
                                onChange={onSearchValueChange}
                                placeholder="Search here"
                            />
                            { 
                                (!errorMsg && !todoList.length && filterTodo) ? (
                                    <div className={styles.input_message}>
                                        Hit Enter to create new item with current value
                                    </div>
                                ) : null
                            }
                            { 
                                (todoList.length && errorMsg) ? (
                                    <div className={styles.input_message}>
                                        { errorMsg }
                                    </div>
                                ) : null
                            }
                        </div>
                    </form>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Todo</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (isFetchTodoList || !todoList.length) ? (
                                <tr>
                                    <td colSpan={5}>
                                        {isFetchTodoList ? (
                                            <h3>Loading...</h3>
                                        ) : (
                                            <h3>No result. Create a new one instead!</h3>
                                        )}
                                    </td>
                                </tr>
                            ) : ( todoList.map( (item, index) => 
                                <tr key={ index } className={selectTodo.id == item.id ? styles.selected_item : ''}>
                                    <td>{ item.id }</td>
                                    <td className={ item.isCompleted ? styles.text_strikethrough : ''}>{ item.todo }</td>
                                    <td>{ item.createdAt }</td>
                                    <td>
                                        <div className={styles.item_action}>
                                            <button className={styles.btn} onClick={() => toggleComplete(item)}>Toggle Complete</button>
                                            <button className={styles.btn} onClick={() => onEditClick(item)}>
                                                { selectTodo.id == item.id ? 'Cancel Edit' : 'Edit' }
                                            </button>
                                            <button className={styles.btn} onClick={() => onDeleteClick(item)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </main>
        </div>
    )
}
