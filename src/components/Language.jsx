
function Language(props) {
    const styles = {
        backgroundColor: props.backgroundColor,
        color: props.color
    }

    return (
        <span className={`language ${props.lost? "lost": ""}`} style={styles}>{props.name}</span>
    )
}

export default Language;