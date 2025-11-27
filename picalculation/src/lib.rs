use core::num;
use std::path::Iter;
use std::time::Instant;

use malachite::base::num::arithmetic::traits::{Factorial, Pow, Reciprocal, Square};
use malachite::base::num::basic::traits::Zero;
use malachite::base::num::conversion::traits::Digits;
use malachite::{Integer, Natural, Rational};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[wasm_bindgen]
pub fn calculate_series() -> Vec<u8> {
    let val = Rational::from(22) / Rational::from(7);
    let (_whole, fraction) = val.digits(&Natural::const_from(10));

    fraction
        .take(10_000)
        .flat_map(|x| x.limbs().next().map(|x| x as u8))
        .collect::<Vec<_>>()
}

#[wasm_bindgen]
pub fn get_ramanujan_series() -> RamanujanSeries {
    RamanujanSeries::new()
}

#[wasm_bindgen]
pub fn ramanujan_series_digits(series: &mut RamanujanSeries, digits: u64) -> Vec<u8> {
    let result = series.evaluate(digits);
    let (whole, fraction) = result.digits(&Natural::const_from(10));

    whole
        .into_iter()
        .chain(fraction.take(digits as usize - 1))
        .map(|x| x.to_digits_asc(&10).first().cloned().unwrap_or(0))
        .collect::<Vec<_>>()
}

#[wasm_bindgen]
pub struct RamanujanSeries {
    next_term: u64,
    sum: Rational,
}

#[derive(Debug)]
enum SeriesError {
    NeedMoreTerms(u64),
}

impl Default for RamanujanSeries {
    fn default() -> Self {
        Self {
            next_term: 0,
            sum: Rational::ZERO,
        }
    }
}

impl RamanujanSeries {
    pub fn new() -> Self {
        Self {
            next_term: 0,
            sum: Rational::ZERO,
        }
    }

    fn ramanujan_term(k: u64) -> Rational {
        let numerator = Natural::factorial(4 * k)
            * (Natural::from(26390u32) * Natural::from(k) + Natural::from(1103u32));
        let denominator = Natural::factorial(k).pow(4) * Natural::from(396u32).pow(4 * k);

        Rational::from_naturals(numerator, denominator)
    }

    pub fn add_term(&mut self) {
        let term = Self::ramanujan_term(self.next_term);
        self.sum += term;
        self.next_term += 1;
    }

    pub fn add_terms(&mut self, num: u64) {
        self.sum += (self.next_term..self.next_term + num)
            .map(Self::ramanujan_term)
            .sum::<Rational>();
        self.next_term += num;
    }

    pub fn evaluate(&mut self, digits: u64) -> Rational {
        loop {
            match self.try_evaluate(digits) {
                Ok(val) => break val,
                Err(SeriesError::NeedMoreTerms(num)) => {
                    self.add_terms(num);
                }
            }
        }
    }

    fn try_evaluate(&self, digits: u64) -> Result<Rational, SeriesError> {
        // convergence is approximately 8 digits per term
        let num_terms = digits / 8 + 1;

        if self.next_term < num_terms {
            return Err(SeriesError::NeedMoreTerms(num_terms - self.next_term));
        }

        let sqrt_2 = sqrt_newtons_method(
            Rational::from(2),
            Rational::from(10).pow(digits).reciprocal(),
        );
        println!(
            "sqrt_2 error: 10^{} ",
            (sqrt_2.clone().square() - Rational::from(2)).approx_log()
                / Rational::from(10).approx_log()
        );

        Ok((&self.sum * Rational::from(2) * sqrt_2 / Rational::from(9801)).reciprocal())
    }
}

fn sqrt_newtons_method(val: Rational, tolerance: Rational) -> Rational {
    // Objective is f(x) = x^2 - val = 0
    // Newton's method reformulates this into a fixed point method
    // g(x) = x - f(x)/f'(x)

    let mut x = val.clone(); // our initial guess for sqrt(val) is val

    loop {
        let update = (x.clone().square() - &val) / (Rational::from(2) * &x);
        //let new_x = (&x + &val / &x) / Rational::from(2);
        x -= &update;

        if update < tolerance {
            break;
        }
    }

    x
}

pub fn chudnovsky_series() -> Vec<u8> {
    fn chudnovsky_term(k: u64) -> Rational {
        let numerator = Natural::factorial(6 * k)
            * (Natural::from(545140134u32) * Natural::from(k) + Natural::from(13591409u32));
        let denominator = Natural::factorial(3 * k) * Natural::factorial(k).pow(3)
            + Natural::from(640320u32).pow(3 * k);

        Rational::from_naturals(numerator, denominator)
    }

    let val: Rational = (1..10).map(chudnovsky_term).sum();
    let (_whole, fraction) = val.digits(&Natural::const_from(10));

    fraction
        .take(10_000)
        .flat_map(|x| x.limbs().next().map(|x| x as u8))
        .collect::<Vec<_>>()
}

#[wasm_bindgen]
pub struct GosperSeries(Box<dyn Iterator<Item = Integer>>);

#[wasm_bindgen]
pub fn get_gosper_series() -> GosperSeries {
    GosperSeries(Box::new(gosper_series_streaming()))
}

#[wasm_bindgen]
pub fn gosper_stream(series: &mut GosperSeries) -> Vec<u8> {
    let mut digits = Vec::new();
    for _ in 0..100 {
        digits.push(
            series
                .0
                .next()
                .unwrap()
                .twos_complement_limbs()
                .map(|x| u8::try_from(x).unwrap())
                .next()
                .unwrap_or(0),
        );
    }
    digits
}

// Also from that same paper
fn gosper_series_streaming() -> impl Iterator<Item = Integer> {
    let state = (
        Integer::from(1),
        Integer::from(180),
        Integer::from(60),
        Integer::from(2),
    );

    (0..).scan(state, |(q, r, t, i), _index| {
        let u: Integer = Integer::from(3)
            * (Integer::from(3) * &*i + Integer::from(1))
            * (Integer::from(3) * &*i + Integer::from(2));
        let y: Integer = (&*q * (Integer::from(27) * &*i - Integer::from(12))
            + Integer::from(5) * &*r)
            / (Integer::from(5) * &*t);

        (*q, *r, *t, *i) = (
            Integer::from(10) * &*q * &*i * (Integer::from(2) * &*i - Integer::from(1)),
            Integer::from(10)
                * &u
                * (&*q * (Integer::from(5) * &*i - Integer::from(2)) + &*r - &y * &*t),
            &*t * &u,
            &*i + Integer::from(1),
        );

        //println!("({})", q.twos_complement_limb_count());

        Some(y)
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    fn test_series() {
        let mut series = RamanujanSeries::new();
        for i in 0..100 {
            let num_digits = i * 1_000;
            let result: Rational = series.evaluate(num_digits);
            let (_whole, digits) = result.digits(&Natural::from(10u32));
            println!("{num_digits} {:?}", digits.take(10).collect::<Vec<_>>());
        }
    }

    #[test]
    fn compare_series_and_spigot() {
        let digits = 20_000;
        let mut series = RamanujanSeries::new();
        series.add_terms(10);
        let result = series.evaluate(digits);
        let (_whole, fraction) = result.digits(&Natural::const_from(10));

        let spigot_stream = gosper_series_streaming().skip(1);

        for (index, (a, b)) in fraction
            .zip(spigot_stream)
            .enumerate()
            .take(digits as usize + 10)
        {
            println!("{a} {b}");
            let a = Integer::from(a);
            if a != b {
                println!("Differ at digit {index}");
                break;
            }
            //assert_eq!(a, b, "should be equal out to {}", index);
        }
    }

    #[test]
    fn test_gosper() {
        let result = gosper_series_streaming();
        for (i, item) in result.enumerate() {
            print!("{:?}", item);
            if i % 10_000 == 0 {
                println!("\n{}", i);
            }
        }
    }

    #[test]
    fn test_sqrt() {
        let val = sqrt_newtons_method(
            Rational::from(2),
            Rational::try_from_float_simplest(1e-3).unwrap(),
        );
        println!("{:?}", val);
    }
}
