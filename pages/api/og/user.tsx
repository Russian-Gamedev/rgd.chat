import {ImageResponse} from '@vercel/og';
import {NextRequest} from 'next/server';
import {CSSProperties} from 'react';
import moment from 'moment';
import 'moment/locale/ru';

export const config = {
	runtime: 'experimental-edge',
};

const WIDTH = 1200;
const HEIGHT = 600;
const FONT_SIZE = 128;
const MAX_CHARS = 18;

export default async function (req: NextRequest) {

	const {searchParams} = new URL(req.url);
	const id = searchParams.get('id');
	const {data: [user]} = await fetch('https://cms.rgd.chat/items/user?filter[id]=' + id).then(res => res.json());

	const nicknameSize = {
		height: 128,
		width: WIDTH - (FONT_SIZE) * 2.2,
		fontSize: (FONT_SIZE * .695)
	};

	if (user.username.length > MAX_CHARS) {
		nicknameSize.fontSize *= MAX_CHARS / user.username.length;
	}

	let firstJoin = moment.duration(moment(new Date()).diff(moment(user.firstJoin)));
	firstJoin.locale('ru');

	return new ImageResponse(
		(
			<div
				style={styles.root}
			>
				<div style={styles.info}>
					<img style={styles.avatar} src={user.avatar} width={128} height={128}/>
					<span style={{
						...styles.nickname,
						...nicknameSize
					}}>{user.username}</span>
				</div>
				<div style={styles.stats}>
					<span>На сервере {firstJoin.humanize()}</span>
					<span>Репутация {user.reputation}</span>
					<span>Понаписал {(Math.round(user.experience/1000)*1000).toLocaleString('ru-RU')} сообщений</span>
					<span>Был в войсе {Math.round(+user.voiceTime / 3600)} часов</span>
				</div>
				<div style={styles.favicon}>
					<svg
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						width={64}
						height={64}
						fill="#fff"
						viewBox="0 0 52 54"
						aria-label="Иконка RGD"
					>
						<path
							fill="#fff"
							d="M24.098 22.297l-3.488-4.18 5.866-6.969-9.83-1.393L5.232 21.6l.475.697h18.39zM26.793 0c5.865 7.142 10.463 14.11 12.524 22.123h6.5C42.012 11.148 34.085 3.833 26.793 0zM14.744 44.071H6.34c-.95 1.045-4.121 3.658-4.28 6.445 0 2.787 1.585 3.31 2.695 3.31 3.33 0 6.976-6.271 7.927-8.361.81-.645 1.427-1.006 2.06-1.394zM17.756 44.071l26.159-.174c3.17 2.961 4.756 5.051 4.756 6.793 0 1.916-2.061 3.31-3.171 3.31-1.902 0-6.024-5.4-8.244-8.013-2.854 1.742-5.073 2.613-7.927 2.613-5.549 0-11.097-3.31-11.573-4.529zM0 24.91v16.374c0 .348.476.348.951.348.916.168 2.219-.096 4.28 0v-6.445h6.025v6.445h5.073c.159-.87.793-6.793-1.902-8.187 1.268-1.045 1.902-1.22 1.902-4.355 0-4.18-1.585-4.18-6.024-4.18H0zm5.073 2.961h5.707c.476 0 .952.174.952.697v3.31H5.073V27.87zM33.927 24.735h-11.89c-2.378 0-4.28 1.22-4.28 4.007v9.232c.158 2.613 1.109 3.658 5.23 3.658h6.342c2.378 0 4.756-.174 4.756-2.613v-7.49h-5.073v5.574H22.83V29.44l11.098-.174v-4.53zM35.83 24.91v16.722h12.524c1.268 0 3.646-.522 3.646-3.484V28.045c0-2.439-2.22-3.135-3.646-3.135H35.829zm4.914 4.529h6.183v7.664h-6.183V29.44z"
						/>
					</svg>
				</div>
			</div>
		),
		{
			width: WIDTH,
			height: HEIGHT,
			//debug: true
		},
	);
}

const styles: Record<string, CSSProperties> = {
	root: {
		fontSize: FONT_SIZE,
		background: 'white',
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#1b1c1f',
		borderRadius: 8,
	},
	favicon: {
		display: 'flex',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: '.25em',
		top: '.25em',
	},
	info: {
		display: 'flex',
		textAlign: 'center',
		margin: '.25em'
	},
	avatar: {
		borderRadius: 9999,
		marginRight: '.1em'
	},
	nickname: {
		whiteSpace: 'nowrap', color: '#fff',
	},
	stats: {
		margin: '.25em',
		marginTop: '1em',
		display: 'flex',
		flexDirection: 'column',
		fontSize: 30,
		color: '#fff',
	}
};