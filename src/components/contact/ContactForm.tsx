import styles from './ContactForm.module.css'

/**
 * No backend submission flow exists (no email service/API/collection) —
 * per the task brief, this is UI-only. Every field and the submit button
 * are disabled, same non-functional pattern already used for the search
 * bars and the newsletter form (`SiteFooter`), with an explicit "Coming
 * Soon" badge since a form (unlike a search box) could otherwise mislead a
 * visitor into thinking a message was actually sent.
 */
export function ContactForm() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Send us a Message</h2>
        <span className={styles.badge}>Coming Soon</span>
      </div>

      <form className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your Full Name"
              disabled
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="email@example.com"
              disabled
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-subject">
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder="Purpose of your inquiry"
            disabled
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            placeholder="Tell us more about how we can help..."
            disabled
            rows={5}
            className={styles.textarea}
          />
        </div>

        <button type="button" disabled className={styles.submit}>
          Send Inquiry
        </button>
      </form>
    </div>
  )
}
