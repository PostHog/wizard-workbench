export default function Page() {
    return (
        <main>
            <h1>Support chat</h1>
            <p>
                Ask a question by POSTing <code>{`{ question, userId, threadId }`}</code> to{' '}
                <code>/api/chat</code>.
            </p>
        </main>
    )
}
