import Invite from '@/components/invite.vue'

export default {
	install(Vue) {
		const Profile = Vue.extend(Invite)

		// 弹出邀请
		Vue.prototype.$openInvite = function(params) {
			const instance = new Profile()
			instance._props._specia = params
			instance.vm = instance.$mount()
			const InviteEle = document.body.lastElementChild
			if (InviteEle.className === 'invite-box') return
			setTimeout(() => document.body.appendChild(instance.vm.$el))
			return instance
		}

		// 关闭邀请
		Vue.prototype.$closeInvite = function() {
			const instance = new Profile()
			instance._props._specia = null
			instance.vm = instance.$mount()
			const InviteEle = document.body.lastElementChild
			if (InviteEle.className !== 'invite-box') return
			document.body.removeChild(InviteEle)
			return instance
		}
	}
}
