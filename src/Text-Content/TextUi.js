import "../styles/tailwind.css";
//import { setupSlider } from "./Slider";

import { AnalyzeButton } from "./AnalyzeButton";
import { initializeFileUpload } from "./FileHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  const homeBtn = document.getElementById("return-home");
  
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  //const { getValue } = setupSlider("length", "showValue"); phased out

  initializeFileUpload();
  AnalyzeButton();
});


const urlField = document.getElementById("url-fieldinput");
urlField.addEventListener('click', () => {
    alert('This was meant to be a feature for extracting data from any links and paste for processing');
}, { once: true });


// -------------------
// LAZY INFERENCE Test
// -------------------

/*  dev test :
setTimeout(() => {
  runInference(` 
"""
Though illness makes the employees discomfort at the work and may stop them to work for quite a some time, most of the times, 
employees return to work after a short while with recovery.Recovery from physical or mental illness takes time allowing the employee 
taking time to resume to work activities with the old abilities and energies.During this time of complete coping with working 
conditions after recovery from mental illness the employee need to be supported in mental, cognitive and behavioral aspects.
There are many intervention strategies available and are popular to be studied by many researchers in the physical illness realm.
However, the studies concerned with return to work after recovery from mental illness are focused on occupational recovery in 
less severe forms of mental illness and some forms of mental disorders.Any illness has a period of recovery mentally and physically. 
However many people who return to work after sustained recovery still need some support from the organization to cope with the missed 
experience in the workplace. According to E Goldner, the return work after mental illness is associated with a significant degree of
residual impairment in function even after the sustainable treatment.The study of Burton and Conti 2000 & McCulloch et al. 2001 as 
cited in E Goldner states that there is some emerging evidence that a disability management approach, similar to that applied to 
recovery from musculoskeletal injury, may yield significantly improved work recovery for depression-related work impairment.
Also there is a need to study disability management and return-to-work factors related to anxiety disorders, such as social 
phobia and panic disorder, given their prevalence and the low availability of appropriate treatment resources, Lepine & et al., 
as cited in Elliot Goldner.Certain factors influence the early recovery from mental illness and the coping mechanism with the 
work place issues.The authors like Brewin et al. 1983; Kenny 1994 as cited in Elliot Goldner, predict that socio-demographic 
characteristics, job satisfaction and referral to appropriate rehabilitation services will effect the rapid recovery and return to work.
However another study conducted by Shaw et al. 2001 on return to work following occupational low back pain, 
it is found that the factors like low workplace support, personal stress, shorter job tenure, prior episodes, 
heavier occupations with no modified duty, delayed reporting, greater severity of pain, more significant functional 
impact and extreme symptom reports protracted the disability.
"""
`);

}, 1000); */

