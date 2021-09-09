import { Color, Euler, Mesh, Points, Vector2, Vector3 } from "three";
import Pin from "./utils/object/pin";

export interface RendererSettings {
	size: Vector2,
	antialias: boolean
}

export interface CameraSettings {
	fov: number,
	aspect: number,
	near: number,
	far: number,
	pos: Vector3
}

export interface TextInformation {
	position: Vector3,
	rotation: Euler,
	src: string,
	text: string,
	identity: string,
	color: Color,
	fadeGroup: number,
	scale: number
}

export interface VertData {
	vertex: boolean,
	index: number
}

export interface ScrollControllerSetting {
	index?: number,
	// 補間イージング
	ease: EasingFn,
	// スクロール感度
	sensibility: number,
	// その区間でスクロール補間をするかどうか
	snap: boolean
}

export interface SceneType {
	moveCamera: "moveCamera",
	fadeTextPlanes: "fadeTextPlanes",
	fadeMountPhoto: "fadeMountPhoto",
	fadeMountMesh: "fadeMountMesh",
	fadeTextBelt: "fadeTextBelt",
	darkenMountPhoto: "darkenMountPhoto",
	moveMountPhoto: "moveMountPhoto",
	setRenderColor: "setRenderColor",
	displayCompanyHistory: "displayCompanyHistory",
	increaseStar: "increaseStar",
	morphStar: "morphStar",
	slideText: "slideText",
	tweenEnterLeaveMountMesh: "tweenEnterLeaveMountMesh",
	tweenEnterLeaveMountPhoto: "tweenEnterLeaveMountPhoto",
	tweenEnterLeaveTextPlanes: "tweenEnterLeaveTextPlanes",
	tweenEnterMountPhoto: "tweenEnterMountPhoto",
	tweenEnterMountMesh: "tweenEnterMountMesh",
	tweenEnterTextPlanes: "tweenEnterTextPlanes",
	tweenAnyTimeTextPlanes: "tweenAnyTimeTextPlanes",
	tweenLeaveTextPlanes: "tweenLeaveTextPlanes",
	tweenEnterCompanyHistory: "tweenEnterCompanyHistory",
	tweenAnyTimeCompanyHistory: "tweenAnyTimeCompanyHistory",
	tweenAnyTimeUpDownPin: "tweenAnyTimeUpDownPin",
	tweenEnterUpDownPin: "tweenEnterUpDownPin",
	tweenAnyTimeMountPhoto: "tweenAnyTimeMountPhoto",
	tweenAnyTimeMountMesh: "tweenAnyTimeMountMesh",
}

export interface SceneSetting {
	index: number,
	moveCamera?: {
		startPosition: Vector3,
		endPosition: Vector3,
		startTargetLookAt: Vector3,
		endTargetLookAt: Vector3
	},
	fadeTextPlanes?: {
		appear?: {
			fadeGroup: number
		},
		disappear?: {
			fadeGroup: number
		}
	}
	fadeMountPhoto?: {
		startAlpha: number,
		endAlpha: number,
		textureKind: string
	},
	fadeMountMesh?: {
		startAlpha: number,
		endAlpha: number,
	},
	moveMountPhoto?: {
		startPosition: Vector3,
		endPosition: Vector3,
	},
	darkenMountPhoto?: {
		startBrightness: number,
		endBrightness: number,
		textureKind: string
	},
	setRenderColor?: {
		startColor: Color,
		endColor: Color,
	},
	displayCompanyHistory?: {
		settings: TextSwappingSettings
	},
	increaseStar?: {
		startStarNum: number
		endStarNum: number
	},
	morphStar?: {
		startMorphAmount: number,
		endMorphAmount: number
	},
	slideText?: {
		startAmount: number,
		endAmount: number
	},
	tweenAnyTimeUpDownPin?: {
		startOffsetY: number,
		endOffsetY: number,
		threshold: number
	},
	fadeTextBelt?: {
		startAlpha: number,
		endAlpha: number
	},
	tweenEnterLeaveMountMesh?: {
		enterAlpha: number,
		leaveAlpha: number
	},
	tweenAnyTimeMountMesh?: {
		enterAlpha: number,
		leaveAlpha: number,
		threshold: number
	},
	tweenEnterMountMesh?: {
		enterAlpha: number,
		leaveAlpha: number,
	}
	tweenEnterLeaveMountPhoto?: {
		enterAlpha: number,
		leaveAlpha: number,
		textureKind: string
	},
	tweenAnyTimeMountPhoto?: {
		enterAlpha: number,
		leaveAlpha: number,
		textureKind: string,
		threshold: number,
	}
	tweenEnterMountPhoto?: {
		enterAlpha: number,
		leaveAlpha: number,
		textureKind: string
	},
	tweenEnterLeaveTextPlanes?: {
		appear?: {
			fadeGroup: number
		},
		disappear?: {
			fadeGroup: number
		},
		delay?: number
	},
	tweenEnterTextPlanes?: {
		appear?: {
			fadeGroup: number
		},
		disappear?: {
			fadeGroup: number
		},
		delay?: number
	},
	tweenLeaveTextPlanes?: {
		appear?: {
			fadeGroup: number
		},
		disappear?: {
			fadeGroup: number
		}
	},
	tweenAnyTimeTextPlanes?: {
		appear?: {
			fadeGroup: number
		},
		disappear?: {
			fadeGroup: number
		},
		threshold: number
		delay?: number
	},
	tweenEnterCompanyHistory?: {
		shouldAppear: boolean
	},
	tweenAnyTimeCompanyHistory?: {
		shouldAppear: boolean,
		threshold: number
	},
	tweenEnterUpDownPin?: {
		startOffsetY: number,
		endOffsetY: number,
	}
}

// イージング関数の型
export type EasingFn = {
	(x: number): number
}

export interface Debug {
	scrollIndexText: HTMLParagraphElement,
	normPosText: HTMLParagraphElement,
	renderInfo: HTMLParagraphElement,
}

export interface CompanyHistory {
	date: HTMLLIElement,
	memberNum: HTMLLIElement,
	ageAverage: HTMLLIElement,
	contents: HTMLLIElement
}

export interface TextSwappingSettings {
	events: Array<{
		date: string,
		contents: string
	}>,
	memberNum: {
		start: string,
		end: string
	},
	averageAge: {
		start: string,
		end: string
	}
}

export interface Town {
	[key: string]: Pin
}

export interface TweenDict {
	[key: string]: GSAPTween
}