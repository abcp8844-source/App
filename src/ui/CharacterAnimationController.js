import * as THREE from 'three';

class CharacterAnimationController {
  constructor() {
    this.activeMixers = [];
    this.currentStateName = 'IDLE';
  }

  // 1. Attach animated skeletal bone linkages to the rendered player 3D mesh
  registerCharacterMixer(playerGroupAsset, loadedGltfAnimations) {
    const animationMixer = new THREE.AnimationMixer(playerGroupAsset);
    const animationClipDirectory = {};

    // Map raw animation tracks (Run, Drift Lean, Hijack, Walk) into clean structural memory
    loadedGltfAnimations.forEach(clip => {
      animationClipDirectory[clip.name.toUpperCase()] = animationMixer.clipAction(clip);
    });

    const mixerNode = {
      uid: playerGroupAsset.uuid,
      mixer: animationMixer,
      clips: animationClipDirectory,
      activeAction: animationClipDirectory['IDLE']
    };

    if (mixerNode.activeAction) mixerNode.activeAction.play();
    this.activeMixers.push(mixerNode);
    return mixerNode;
  }

  // 2. Interpolate animation weighting (Cross-fade) to avoid cartoonish frame cutting
  transitionToNewState(mixerNode, targetStateName, crossFadeDuration = 0.25) {
    if (this.currentStateName === targetStateName) return;

    const currentAction = mixerNode.activeAction;
    const targetAction = mixerNode.clips[targetStateName.toUpperCase()];

    if (!targetAction) return; // Fallback to safe state if asset file is missing

    targetAction.reset();
    targetAction.setEffectiveWeight(1.0);
    targetAction.play();

    if (currentAction) {
      // Smoothly blend the current stance into the new stance (e.g., Running to Driving lean)
      currentAction.crossFadeTo(targetAction, crossFadeDuration, true);
    }

    mixerNode.activeAction = targetAction;
    this.currentStateName = targetStateName;
  }

  // 3. Advance the animation time buffers exactly pinned to the GPU frame tick delta
  advanceAnimationTimers(deltaTimeSeconds) {
    this.activeMixers.forEach(node => {
      node.mixer.update(deltaTimeSeconds);
    });
  }
}

const animationControllerInstance = new CharacterAnimationController();
export default animationControllerInstance;
