import styles from '../styles/blog.module.css'

export default function PostContent({ content }) {
    return <div className={styles.postContent}
    dangerouslySetInnerHTML={{ __html: content }}></div>
  }
  