


export default function userProfile({params}: {params: {id: string}}){
    return (
        <div>
            <h1>Profile</h1><hr />
            <p className="text-4xl">Profile page <span className="p-2 ml-2 bg-orange-500">{params.id}</span></p>
        </div>
    )
}
