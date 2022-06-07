export {getListApiVersion, createNewItemApi, updateItemApi, deleteItemApi} 




function getListApiVersion (callback) {
    const api_fullists = `https://authencation.vercel.app/api/todo/list`
     fetch(api_fullists, {
        method : "GET"
    })
        .then(res => res.json())
        .then(callback)
        .catch(err => console.log(err))
}



function createNewItemApi (callback, name,userId) {
    const api_createNew = `https://authencation.vercel.app/api/todo/create`
    const data = {name : name,
                  user_id :  userId}
    console.log(name)
     fetch(api_createNew, {
        method : "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(data),
    })
        .then(res => res.json())
        .then(callback)
        .catch(err => {
            alert('Name must be 2 characters long')
            console.log(err) 
        })
}

function updateItemApi (callback,id,newName) {
    const api_update = `https://authencation.vercel.app/api/todo/update?id=${id}`
    const data = {name : newName}
    fetch(api_update, {
       method : "POST",
       headers: {
        'Content-Type': 'application/json',
        },
       body : JSON.stringify(data),
   })
       .then(res => res.json())
       .then(callback)
       .catch(err => console.log(err))
}

function deleteItemApi (callback,id) {
    const api_delete = `https://authencation.vercel.app/api/todo/delete?id=${id}`
    fetch(api_delete, {
       method : "POST",
   })
       .then(res => res.json())
       .then(callback)
       .catch(err => console.log(err))
}

export function inforApi (callback,id) {
    const api_delete = `https://authencation.vercel.app/api/user/get?id=${id}`
    fetch(api_delete, {
       method : "GET",
   })
       .then(res => res.json())
       .then(callback)
       .catch(err => console.log(err))
}