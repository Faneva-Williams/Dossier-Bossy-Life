<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress_db' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '&Vq.LP;^Fpx7qoLRXH9508tNgcVzR*`Sk|_c9z+B~q u`<LF$|,S&]s*zlB[>}p=' );
define( 'SECURE_AUTH_KEY',  '55`zCHH~~qc(7s[Ytp7Ji?H(pdpw~#DHB1Vegokd+^Mk%cu4W$H?)zt[X+C+T*7*' );
define( 'LOGGED_IN_KEY',    'qcJ=ob$Az4o8K:C2]]8X-py-=jF7b4ZZVrx7rdM!+ZH~LC@[5,jKzYtY_<];T?B)' );
define( 'NONCE_KEY',        'vnat8ocy`JTJh(SA+&)]ycQPBm1[dVaCob<c~FsO(J$/,<n5Q3L.n*mpJ<>*lbd@' );
define( 'AUTH_SALT',        'sal44l%;O&h^%Q],PoIy(cNl1S?L8/oA.,8aP>uiaK&-|p0h4QZc[ Fu2wT=Ytf@' );
define( 'SECURE_AUTH_SALT', 'Z)vsgW!a{({3GBhdDr(e~GquQ};L{0GT@oN,re,`No|nI~];45+I/%KGkmZayqhV' );
define( 'LOGGED_IN_SALT',   'KNID8J3cH0,/9<=[`NEzeg&Vcx.5Zp4 x$=uS1+,t9uT=1yBl|Y+L.[`Z}dU|`jA' );
define( 'NONCE_SALT',       'lUZ!e>~Ng#e-&FQ2(]Vm-Du!qkz:OtoA^)*]NzIkj,5+QS,rc}P<AW K6`fC&h^6' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
